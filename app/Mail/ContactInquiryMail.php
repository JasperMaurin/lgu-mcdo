<?php

namespace App\Mail;

use App\Models\ContactRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactInquiryMail extends Mailable
{
    use Queueable, SerializesModels;

    public ContactRequest $contactRequest;

    /**
     * Create a new message instance.
     */
    public function __construct(ContactRequest $contactRequest)
    {
        $this->contactRequest = $contactRequest;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $prefix = $this->contactRequest->is_pre_registration_seminar 
            ? '🏛️ [Pre-Registration Seminar Request]' 
            : '📩 [Website Contact Message]';

        $subjectText = "{$prefix} {$this->contactRequest->subject} from {$this->contactRequest->name}";

        return new Envelope(
            subject: $subjectText,
            replyTo: [
                new \Illuminate\Mail\Mailables\Address($this->contactRequest->email, $this->contactRequest->name),
            ],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-inquiry',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
