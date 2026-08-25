<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LoginSecurityCode extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $code
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Security Verification Token - MCDO Opol Login');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.login-security-code');
    }

    public function attachments(): array
    {
        return [];
    }
}
