<?php

namespace App\Http\Controllers;

use App\Mail\ContactConfirmationMail;
use App\Mail\ContactInquiryMail;
use App\Models\ContactRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Show the Contact page.
     */
    public function index(Request $request)
    {
        $subject = $request->query('subject') ?? $request->query('type') ?? '';

        return Inertia::render('Contact', [
            'initialSubject' => $subject,
        ]);
    }

    /**
     * Handle submission of contact message / Pre-Registration Seminar request.
     */
    public function store(Request $request)
    {
        // Rate limiting (max 10 submissions per 10 minutes per IP)
        $ip = $request->ip();
        $rateLimitKey = 'contact_form_ip_' . $ip;
        if (RateLimiter::tooManyAttempts($rateLimitKey, 10)) {
            $seconds = RateLimiter::availableIn($rateLimitKey);
            return response()->json([
                'success' => false,
                'message' => "Too many messages sent. Please wait {$seconds} seconds before trying again.",
            ], 429);
        }
        RateLimiter::hit($rateLimitKey, 600);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email:filter|max:255',
            'phone' => 'nullable|string|max:50',
            'subject' => 'required|string|max:100',
            'cooperative_name' => 'nullable|string|max:255',
            'attendees_count' => 'nullable|integer|min:1|max:1000',
            'preferred_date' => 'nullable|date',
            'message' => 'required|string|max:5000',
        ]);

        $subject = $validated['subject'];
        $isSeminar = (
            stripos($subject, 'Pre-Registration Seminar') !== false ||
            stripos($subject, 'seminar') !== false ||
            stripos($subject, 'pmes') !== false
        );

        // Generate clean reference number
        $prefix = $isSeminar ? 'PR' : 'INQ';
        $datePart = now()->format('ymd');
        $randomPart = strtoupper(Str::random(4));
        $referenceNo = "{$prefix}-{$datePart}-{$randomPart}";

        $contactRequest = ContactRequest::create([
            'reference_no' => $referenceNo,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => $validated['subject'],
            'is_pre_registration_seminar' => $isSeminar,
            'cooperative_name' => $validated['cooperative_name'] ?? null,
            'attendees_count' => $validated['attendees_count'] ?? null,
            'preferred_date' => $validated['preferred_date'] ?? null,
            'message' => $validated['message'],
            'status' => 'Pending',
            'ip_address' => $ip,
        ]);

        $adminEmail = env('MCDO_ADMIN_EMAIL', 'opolmcdo@gmail.com');

        // 1. Send Notification Email to MCDO Office
        try {
            Mail::to($adminEmail)->send(new ContactInquiryMail($contactRequest));
        } catch (\Throwable $e) {
            Log::error('Failed to send contact inquiry email to MCDO admin: ' . $e->getMessage());
        }

        // 2. Send Confirmation Email to Applicant
        try {
            Mail::to($contactRequest->email)->send(new ContactConfirmationMail($contactRequest));
        } catch (\Throwable $e) {
            Log::error('Failed to send confirmation email to applicant: ' . $e->getMessage());
        }

        $successMessage = $isSeminar
            ? "Your Pre-Registration Seminar request has been submitted successfully! A confirmation email has been sent to {$contactRequest->email}."
            : "Your message has been sent successfully! Our office will get back to you shortly.";

        if ($request->wantsJson() || $request->header('X-Inertia')) {
            return response()->json([
                'success' => true,
                'reference_no' => $contactRequest->reference_no,
                'is_seminar' => $isSeminar,
                'message' => $successMessage,
                'details' => [
                    'name' => $contactRequest->name,
                    'email' => $contactRequest->email,
                    'subject' => $contactRequest->subject,
                    'reference_no' => $contactRequest->reference_no,
                ]
            ]);
        }

        return redirect()->back()->with('success', $successMessage);
    }
}
