<?php

namespace App\Mail;

use App\Models\CooperativeProfile;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CooperativeProfileSavedMail extends Mailable
{
    use Queueable, SerializesModels;

    public CooperativeProfile $profile;
    public string $action;

    /**
     * Create a new message instance.
     *
     * @param CooperativeProfile $profile
     * @param string $action 'submitted' | 'updated'
     */
    public function __construct(CooperativeProfile $profile, string $action = 'submitted')
    {
        $this->profile = $profile;
        $this->action = $action;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $actionTitle = $this->action === 'updated' ? 'Record Updated' : 'Profile Saved & Registered';
        return new Envelope(
            subject: "Cooperative Profile {$actionTitle} - Municipal Cooperative Development Office (MCDO)",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.cooperative-profile-saved',
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
