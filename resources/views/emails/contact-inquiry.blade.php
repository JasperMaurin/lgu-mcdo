<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Website Request / Message</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f1f5f9;
            color: #1e293b;
            -webkit-font-smoothing: antialiased;
        }
        .email-wrapper {
            width: 100%;
            background-color: #f1f5f9;
            padding: 30px 15px;
        }
        .email-container {
            max-width: 620px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        .email-header {
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
            padding: 28px 24px;
            text-align: center;
            border-bottom: 3px solid #dc2626;
        }
        .email-logo {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
            margin-bottom: 12px;
        }
        .email-header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .email-header p {
            color: #93c5fd;
            margin: 6px 0 0;
            font-size: 13px;
            font-weight: 500;
        }
        .badge-bar {
            background-color: {{ $contactRequest->is_pre_registration_seminar ? '#fee2e2' : '#e0e7ff' }};
            border-bottom: 1px solid {{ $contactRequest->is_pre_registration_seminar ? '#fecaca' : '#c7d2fe' }};
            padding: 10px 24px;
            text-align: center;
        }
        .badge {
            display: inline-block;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: {{ $contactRequest->is_pre_registration_seminar ? '#991b1b' : '#3730a3' }};
        }
        .email-body {
            padding: 30px 24px;
        }
        .meta-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 18px 20px;
            margin-bottom: 24px;
        }
        .meta-row {
            display: table;
            width: 100%;
            margin-bottom: 10px;
        }
        .meta-row:last-child {
            margin-bottom: 0;
        }
        .meta-label {
            display: table-cell;
            width: 38%;
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            vertical-align: middle;
        }
        .meta-value {
            display: table-cell;
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
            vertical-align: middle;
        }
        .meta-value a {
            color: #2563eb;
            text-decoration: none;
        }
        .seminar-box {
            background-color: #eff6ff;
            border: 2px dashed #93c5fd;
            border-radius: 10px;
            padding: 18px 20px;
            margin-bottom: 24px;
        }
        .seminar-title {
            margin: 0 0 12px 0;
            font-size: 13px;
            font-weight: 800;
            color: #1e40af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .message-section {
            margin-bottom: 24px;
        }
        .section-label {
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            display: block;
        }
        .message-box {
            background-color: #ffffff;
            border: 1px solid #cbd5e1;
            border-left: 4px solid #2563eb;
            border-radius: 6px;
            padding: 16px 18px;
            font-size: 14px;
            line-height: 1.6;
            color: #334155;
            white-space: pre-wrap;
        }
        .action-button {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff !important;
            font-size: 13px;
            font-weight: 700;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            text-align: center;
        }
        .email-footer {
            background-color: #f8fafc;
            padding: 20px 24px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
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
                <h1>Municipal Cooperative Development Office</h1>
                <p>Opol, Misamis Oriental &bull; Website Inquiry Notification</p>
            </div>

            <!-- Subject Ribbon -->
            <div class="badge-bar">
                <span class="badge">
                    @if($contactRequest->is_pre_registration_seminar)
                        🏛️ Pre-Registration Seminar Request &bull; Ref #{{ $contactRequest->reference_no }}
                    @else
                        📩 Website Inquiry &bull; Ref #{{ $contactRequest->reference_no }}
                    @endif
                </span>
            </div>

            <!-- Body -->
            <div class="email-body">
                <!-- Contact Details -->
                <div class="meta-card">
                    <div class="meta-row">
                        <span class="meta-label">Sender Name:</span>
                        <span class="meta-value">{{ $contactRequest->name }}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Email Address:</span>
                        <span class="meta-value"><a href="mailto:{{ $contactRequest->email }}">{{ $contactRequest->email }}</a></span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Phone Number:</span>
                        <span class="meta-value">
                            @if($contactRequest->phone)
                                <a href="tel:{{ $contactRequest->phone }}">{{ $contactRequest->phone }}</a>
                            @else
                                <span style="color:#94a3b8; font-weight: normal;">Not provided</span>
                            @endif
                        </span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Selected Topic:</span>
                        <span class="meta-value" style="color: #2563eb;">{{ $contactRequest->subject }}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Date Submitted:</span>
                        <span class="meta-value">{{ $contactRequest->created_at ? $contactRequest->created_at->format('M d, Y - h:i A') : now()->format('M d, Y - h:i A') }}</span>
                    </div>
                </div>

                @if($contactRequest->is_pre_registration_seminar)
                    <!-- Pre-Registration Seminar Details -->
                    <div class="seminar-box">
                        <h4 class="seminar-title">📋 Seminar / Cooperative Details</h4>
                        <div class="meta-row">
                            <span class="meta-label">Proposed Co-op:</span>
                            <span class="meta-value">{{ $contactRequest->cooperative_name ?: 'Prospective / To be organized' }}</span>
                        </div>
                        @if($contactRequest->attendees_count)
                            <div class="meta-row">
                                <span class="meta-label">Est. Participants:</span>
                                <span class="meta-value">{{ $contactRequest->attendees_count }} attendees</span>
                            </div>
                        @endif
                        @if($contactRequest->preferred_date)
                            <div class="meta-row">
                                <span class="meta-label">Preferred Date:</span>
                                <span class="meta-value">{{ \Carbon\Carbon::parse($contactRequest->preferred_date)->format('F d, Y') }}</span>
                            </div>
                        @endif
                    </div>
                @endif

                <!-- Message Section -->
                <div class="message-section">
                    <span class="section-label">Message / Details:</span>
                    <div class="message-box">{{ $contactRequest->message }}</div>
                </div>

                @php
                    if ($contactRequest->is_pre_registration_seminar) {
                        $replyBody = "Dear " . $contactRequest->name . ",\n\n"
                            . "Good day! Thank you for requesting a Pre-Registration Seminar (PMES) for " . ($contactRequest->cooperative_name ?: 'your proposed cooperative') . " (Ref #" . $contactRequest->reference_no . ").\n\n"
                            . "We have received your request" . ($contactRequest->preferred_date ? " for " . \Carbon\Carbon::parse($contactRequest->preferred_date)->format('F d, Y') : "") . ".\n\n"
                            . "To proceed with scheduling and preparing orientation materials, kindly confirm the following details:\n"
                            . "1. Complete Proposed Cooperative Name: " . ($contactRequest->cooperative_name ?: '[Please specify]') . "\n"
                            . "2. Target Venue / Location in Opol: [Office / Barangay Hall / MCDO Training Center]\n"
                            . "3. Final Number of Attendees: " . ($contactRequest->attendees_count ? $contactRequest->attendees_count . ' participants' : '[e.g. 15-25]') . "\n"
                            . "4. Contact Person & Mobile: " . ($contactRequest->phone ?: '[Mobile Number]') . "\n\n"
                            . "Please let us know if this schedule works for your group. Feel free to contact our office at 0906-358-0335 if you have any questions.\n\n"
                            . "Best regards,\n"
                            . "Municipal Cooperative Development Office (MCDO)\n"
                            . "LGU Opol, Misamis Oriental\n"
                            . "opolmcdo@gmail.com | 0906-358-0335";
                    } else {
                        $replyBody = "Dear " . $contactRequest->name . ",\n\n"
                            . "Good day! Thank you for contacting the Municipal Cooperative Development Office (MCDO) of Opol regarding \"" . $contactRequest->subject . "\" (Ref #" . $contactRequest->reference_no . ").\n\n"
                            . "[Insert response here]\n\n"
                            . "If you need further assistance, please reply to this email or visit our office at the Municipal Hall, Poblacion, Opol.\n\n"
                            . "Best regards,\n"
                            . "Municipal Cooperative Development Office (MCDO)\n"
                            . "LGU Opol, Misamis Oriental\n"
                            . "opolmcdo@gmail.com | 0906-358-0335";
                    }
                @endphp

                <!-- Quick Action -->
                <div style="text-align: center; margin-top: 28px;">
                    <a href="mailto:{{ $contactRequest->email }}?subject={{ rawurlencode('RE: ' . $contactRequest->subject . ' [Ref #' . $contactRequest->reference_no . ']') }}&body={{ rawurlencode($replyBody) }}" class="action-button">
                        Reply Directly via Email &rarr;
                    </a>
                </div>
            </div>

            <!-- Footer -->
            <div class="email-footer">
                <p style="margin: 0 0 4px 0;">This email was automatically generated by the MCDO Website Portal.</p>
                <p style="margin: 0;">&copy; {{ date('Y') }} Municipal Cooperative Development Office &bull; Opol, Misamis Oriental</p>
            </div>
        </div>
    </div>
</body>
</html>
