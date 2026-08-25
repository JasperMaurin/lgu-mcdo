<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ProfileVerificationCode extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $code,
        public readonly string $changeType,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your MCDO Opol verification code');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.profile-verification-code');
    }

    public function attachments(): array
    {
        return [];
    }
}
