<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\FeedbackSubmittedMail;

class FeedbackController extends Controller
{
    public function index()
    {
        $feedbacks = \App\Models\Feedback::with(['qrCode', 'trainingEvaluation'])->orderBy('created_at', 'desc')->get()->map(function ($fb) {
            return [
                'id' => 'FB-' . str_pad($fb->id, 5, '0', STR_PAD_LEFT),
                'qrCode' => $fb->qr_code_id,
                'name' => $fb->isAnonymous ? 'Anonymous User' : ($fb->name ?: 'N/A'),
                'userType' => $fb->isAnonymous ? 'Unknown' : ($fb->cooperative ?: 'Citizen'),
                'municipality' => $fb->isAnonymous ? 'Unknown' : ($fb->barangay ?: 'N/A'),
                'service' => $fb->qrCode ? $fb->qrCode->name : 'Unknown Service',
                'type' => $fb->visitReason ?: 'General',
                'rating' => $fb->rating,
                'status' => $fb->status,
                'date' => $fb->created_at->toIso8601String(),
                'comments' => "Timeliness: {$fb->timeliness} | Professionalism: {$fb->professionalism} | Clarity: {$fb->clarity}",
                'strengths' => $fb->strengths,
                'improvements' => $fb->improvements,
                'email' => $fb->email,
                'trainingEvaluation' => $fb->trainingEvaluation
            ];
        });

        return \Inertia\Inertia::render('Feedback/All', [
            'feedbacks' => $feedbacks
        ]);
    }

    public function show($code)
    {
        $qrCode = \App\Models\QrCode::where('token', $code)->orWhere('id', $code)->first();
        
        if (!$qrCode) {
            return \Inertia\Inertia::render('Feedback/Inactive', [
                'code' => $code,
                'status' => 'not_found',
            ]);
        }

        if ($qrCode->status !== 'Active') {
            return \Inertia\Inertia::render('Feedback/Inactive', [
                'code' => $code,
                'status' => $qrCode->status,
                'qrDetails' => [
                    'name' => $qrCode->name,
                    'category' => $qrCode->category,
                    'venue' => $qrCode->venue,
                    'date' => $qrCode->date,
                ]
            ]);
        }

        // Increment scans when the page is loaded
        $qrCode->increment('scans');

        return \Inertia\Inertia::render('Feedback/Show', [
            'code' => $qrCode->id,
            'qrDetails' => $qrCode
        ]);
    }

    public function store(Request $request, $code)
    {
        $qrCode = \App\Models\QrCode::where('token', $code)->orWhere('id', $code)->first();

        if (!$qrCode) {
            return \Inertia\Inertia::render('Feedback/Inactive', [
                'code' => $code,
                'status' => 'not_found',
            ]);
        }

        if ($qrCode->status !== 'Active') {
            return \Inertia\Inertia::render('Feedback/Inactive', [
                'code' => $code,
                'status' => $qrCode->status,
                'qrDetails' => [
                    'name' => $qrCode->name,
                    'category' => $qrCode->category,
                    'venue' => $qrCode->venue,
                    'date' => $qrCode->date,
                ]
            ]);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'timeliness' => 'nullable|string',
            'professionalism' => 'nullable|string',
            'clarity' => 'nullable|string',
            'visitReason' => 'nullable|string',
            'strengths' => 'nullable|string',
            'improvements' => 'nullable|string',
            'name' => 'nullable|string',
            'barangay' => 'nullable|string',
            'cooperative' => 'nullable|string',
            'email' => 'nullable|email',
            'isAnonymous' => 'boolean',

            // Normalized Training Evaluation fields (2NF)
            'likedMost' => 'nullable|string',
            'disliked' => 'nullable|string',
            'helpfulTopic' => 'nullable|string',
            'unusableTopic' => 'nullable|string',
            'futureTraining' => 'nullable|string',
            'trainerRating' => 'nullable|string',
            'timeSufficient' => 'nullable|string',
            'venueFeedback' => 'nullable|string',
            'recommendTraining' => 'nullable|string',
            'timePerTopicRating' => 'nullable|string',
            'timePerTopicComment' => 'nullable|string',
            'trainingDurationRating' => 'nullable|string',
            'trainingDurationComment' => 'nullable|string',
            'expectationsMet' => 'nullable|string',
            'objectivesAchieved' => 'nullable|string',
            'topicsContent' => 'nullable|string',
            'activitiesConducted' => 'nullable|string',
            'teachingMethods' => 'nullable|string',
            'teachingMaterials' => 'nullable|string',
            'speakersRating' => 'nullable|string',
            'facilitatorsRating' => 'nullable|string',
            'facilitiesServices' => 'nullable|string',
        ]);

        $feedbackData = collect($validated)->only([
            'rating', 'timeliness', 'professionalism', 'clarity', 'visitReason',
            'strengths', 'improvements', 'name', 'barangay', 'cooperative', 'email', 'isAnonymous'
        ])->toArray();

        $feedbackData['qr_code_id'] = $qrCode->id;
        
        $feedback = \App\Models\Feedback::create($feedbackData);

        // Store 2NF normalized TrainingEvaluation if training feedback is submitted
        if (($validated['visitReason'] ?? '') === 'Training / Seminar' || !empty($validated['likedMost']) || !empty($validated['expectationsMet'])) {
            \App\Models\TrainingEvaluation::create([
                'feedback_id' => $feedback->id,
                'liked_most' => $validated['likedMost'] ?? null,
                'disliked' => $validated['disliked'] ?? null,
                'helpful_topic' => $validated['helpfulTopic'] ?? null,
                'unusable_topic' => $validated['unusableTopic'] ?? null,
                'future_training' => $validated['futureTraining'] ?? null,
                'trainer_rating' => $validated['trainerRating'] ?? null,
                'time_sufficient' => $validated['timeSufficient'] ?? null,
                'venue_feedback' => $validated['venueFeedback'] ?? null,
                'recommend_training' => $validated['recommendTraining'] ?? null,
                'time_per_topic_rating' => $validated['timePerTopicRating'] ?? null,
                'time_per_topic_comment' => $validated['timePerTopicComment'] ?? null,
                'training_duration_rating' => $validated['trainingDurationRating'] ?? null,
                'training_duration_comment' => $validated['trainingDurationComment'] ?? null,
                'expectations_met' => $validated['expectationsMet'] ?? null,
                'objectives_achieved' => $validated['objectivesAchieved'] ?? null,
                'topics_content' => $validated['topicsContent'] ?? null,
                'activities_conducted' => $validated['activitiesConducted'] ?? null,
                'teaching_methods' => $validated['teachingMethods'] ?? null,
                'teaching_materials' => $validated['teachingMaterials'] ?? null,
                'speakers_rating' => $validated['speakersRating'] ?? null,
                'facilitators_rating' => $validated['facilitatorsRating'] ?? null,
                'facilities_services' => $validated['facilitiesServices'] ?? null,
            ]);
        }

        // Update QrCode stats
        $qrCode->increment('feedback');
        
        $avgRating = \App\Models\Feedback::where('qr_code_id', $qrCode->id)->avg('rating');
        $qrCode->rating = round($avgRating, 1);
        $qrCode->save();

        if (!empty($validated['email']) && empty($validated['isAnonymous'])) {
            try {
                Mail::to($validated['email'])->send(new FeedbackSubmittedMail($feedback));
            } catch (\Exception $e) {
                // Log error or ignore if mail fails so it doesn't break submission
                \Illuminate\Support\Facades\Log::error('Failed to send feedback email: ' . $e->getMessage());
            }
        }

        return redirect('/feedback/all')->with('success', 'Feedback submitted successfully!');
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Under Review,Resolved,Archived'
        ]);

        $feedback = \App\Models\Feedback::findOrFail($id);
        $feedback->status = $validated['status'];
        $feedback->save();

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    public function destroy($id)
    {
        $feedback = \App\Models\Feedback::findOrFail($id);
        $feedback->delete();

        return redirect()->back()->with('success', 'Feedback deleted successfully!');
    }
}
