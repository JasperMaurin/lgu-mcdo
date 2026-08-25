<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request Received - MCDO Opol</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #334155;
            -webkit-font-smoothing: antialiased;
        }
        .email-wrapper {
            width: 100%;
            background-color: #f8fafc;
            padding: 40px 15px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        .email-header {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
            padding: 30px 24px;
            text-align: center;
            border-bottom: 3px solid #dc2626;
        }
        .email-logo {
            width: 76px;
            height: 76px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15);
            margin-bottom: 14px;
        }
        .email-header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 0.5px;
        }
        .email-header p {
            color: #bfdbfe;
            margin: 6px 0 0;
            font-size: 13px;
            font-weight: 500;
        }
        .email-body {
            padding: 34px 28px;
            line-height: 1.7;
        }
        .greeting {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            margin-top: 0;
            margin-bottom: 16px;
        }
        .content-text {
            font-size: 14px;
            color: #475569;
            margin-bottom: 20px;
        }
        .highlight-card {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-left: 4px solid #16a34a;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 24px 0;
        }
        .highlight-card p {
            margin: 0;
            font-size: 14px;
            color: #166534;
            font-weight: 500;
        }
        .summary-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 18px 20px;
            margin: 24px 0;
        }
        .summary-title {
            margin: 0 0 12px 0;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
        }
        .summary-item {
            font-size: 13px;
            margin-bottom: 8px;
            color: #334155;
        }
        .summary-item:last-child {
            margin-bottom: 0;
        }
        .summary-item strong {
            color: #0f172a;
            display: inline-block;
            min-width: 130px;
        }
        .steps-box {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 18px 20px;
            border-left: 3px solid #2563eb;
            margin: 24px 0;
        }
        .steps-title {
            margin: 0 0 10px 0;
            font-size: 13px;
            font-weight: 700;
            color: #1e3a8a;
        }
        .steps-list {
            margin: 0;
            padding-left: 18px;
            font-size: 13px;
            color: #475569;
        }
        .steps-list li {
            margin-bottom: 6px;
        }
        .contact-info {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px 18px;
            margin-top: 24px;
            font-size: 12px;
            color: #64748b;
        }
        .sign-off {
            margin-top: 30px;
            font-size: 14px;
            color: #475569;
        }
        .sign-off strong {
            color: #0f172a;
            display: block;
            margin-bottom: 2px;
        }
        .email-footer {
            background-color: #f8fafc;
            padding: 20px 24px;
            text-align: center;
            border-top: 1px solid #f1f5f9;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <img src="{{ $message->embed(resource_path('Images/mcdologs.jpg')) }}" alt="MCDO Logo" class="email-logo">
                <h1>MCDO Opol</h1>
                <p>Municipal Cooperative Development Office &bull; Misamis Oriental</p>
            </div>

            <!-- Body -->
            <div class="email-body">
                <p class="greeting">Hello {{ $contactRequest->name }},</p>

                @if($contactRequest->is_pre_registration_seminar)
                    <p class="content-text">
                        Thank you for requesting a <strong>Pre-Registration Seminar (PMES)</strong> with the Municipal Cooperative Development Office (MCDO) of Opol.
                    </p>

                    <div class="highlight-card">
                        <p>
                            ✅ <strong>Request Successfully Logged!</strong> Your application has been queued under Reference Number: <strong>{{ $contactRequest->reference_no }}</strong>.
                        </p>
                    </div>

                    <div class="summary-box">
                        <h4 class="summary-title">Summary of Your Request</h4>
                        <div class="summary-item"><strong>Topic:</strong> Pre-Registration Seminar (PMES)</div>
                        @if($contactRequest->cooperative_name)
                            <div class="summary-item"><strong>Proposed Co-op:</strong> {{ $contactRequest->cooperative_name }}</div>
                        @endif
                        @if($contactRequest->attendees_count)
                            <div class="summary-item"><strong>Estimated Attendees:</strong> {{ $contactRequest->attendees_count }}</div>
                        @endif
                        @if($contactRequest->preferred_date)
                            <div class="summary-item"><strong>Preferred Date:</strong> {{ \Carbon\Carbon::parse($contactRequest->preferred_date)->format('F d, Y') }}</div>
                        @endif
                    </div>

                    <div class="steps-box">
                        <h4 class="steps-title">What Happens Next?</h4>
                        <ol class="steps-list">
                            <li>Our Cooperative Development Officer will review your request and schedule.</li>
                            <li>We will contact you via email (<strong>{{ $contactRequest->email }}</strong>) or phone to finalize the seminar date, venue, and attendance list.</li>
                            <li>Upon completion of the seminar, certificates of pre-registration compliance will be issued for CDA submission.</li>
                        </ol>
                    </div>
                @else
                    <p class="content-text">
                        Thank you for contacting the Municipal Cooperative Development Office (MCDO) of Opol. We have received your message regarding <strong>{{ $contactRequest->subject }}</strong>.
                    </p>

                    <div class="highlight-card">
                        <p>
                            ✅ <strong>Message Received!</strong> Your inquiry has been registered under Reference Number: <strong>{{ $contactRequest->reference_no }}</strong>.
                        </p>
                    </div>

                    <p class="content-text">
                        Our staff reviews messages regularly during office hours (Monday to Friday, 8:00 AM – 5:00 PM). A team member will get in touch with you shortly.
                    </p>
                @endif

                <div class="contact-info">
                    <strong>Need urgent assistance?</strong><br>
                    📍 Office: Municipal Hall, Poblacion, Opol, Misamis Oriental<br>
                    📞 Phone: 0906-358-0335 / 0970-079-4574<br>
                    📧 Email: opolmcdo@gmail.com
                </div>

                <div class="sign-off">
                    <p>Respectfully yours,</p>
                    <strong>The MCDO Team</strong>
                    <span>Local Government of Opol, Misamis Oriental</span>
                </div>
            </div>

            <!-- Footer -->
            <div class="email-footer">
                <p style="margin: 0 0 4px 0;">This is an automated confirmation sent to {{ $contactRequest->email }}.</p>
                <p style="margin: 0;">&copy; {{ date('Y') }} Municipal Cooperative Development Office &bull; All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
