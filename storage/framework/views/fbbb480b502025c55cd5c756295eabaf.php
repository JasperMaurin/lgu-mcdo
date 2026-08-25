<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cooperative Profile Confirmation - MCDO</title>
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
            padding: 40px 20px;
            box-sizing: border-box;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
            border: 1px solid #e2e8f0;
        }
        .email-header {
            background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%);
            padding: 36px 30px 28px;
            text-align: center;
            position: relative;
        }
        .email-logo-box {
            display: inline-block;
            margin-bottom: 14px;
        }
        .email-logo {
            width: 86px;
            height: 86px;
            border-radius: 50%;
            object-fit: cover;
            border: 3.5px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            background-color: #ffffff;
        }
        .email-header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 0.3px;
            text-transform: uppercase;
        }
        .email-header p {
            color: #93c5fd;
            margin: 6px 0 0;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        .header-badge {
            display: inline-block;
            margin-top: 12px;
            padding: 4px 12px;
            background-color: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 20px;
            color: #ffffff;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .email-body {
            padding: 36px 32px;
            line-height: 1.6;
        }
        .greeting {
            font-size: 17px;
            font-weight: 700;
            color: #0f172a;
            margin-top: 0;
            margin-bottom: 16px;
        }
        .content-text {
            font-size: 14.5px;
            color: #475569;
            margin-bottom: 22px;
            line-height: 1.65;
        }
        .status-card {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-left: 5px solid #16a34a;
            padding: 18px 20px;
            border-radius: 10px;
            margin: 24px 0 28px;
        }
        .status-title {
            margin: 0 0 6px;
            color: #15803d;
            font-size: 15px;
            font-weight: 700;
            display: flex;
            align-items: center;
        }
        .status-desc {
            margin: 0;
            color: #166534;
            font-size: 13.5px;
            line-height: 1.5;
        }
        .details-table-wrapper {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 28px;
        }
        .details-table-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #64748b;
            margin: 0 0 14px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
        }
        .details-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #e2e8f0;
            font-size: 13.5px;
        }
        .details-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        .details-label {
            color: #64748b;
            font-weight: 500;
        }
        .details-value {
            color: #0f172a;
            font-weight: 700;
            text-align: right;
        }
        .badge-compliant {
            display: inline-block;
            padding: 2px 8px;
            background-color: #dcfce7;
            color: #15803d;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 700;
        }
        .sign-off {
            margin-top: 32px;
            padding-top: 20px;
            border-top: 1px solid #f1f5f9;
            font-size: 14px;
            color: #475569;
        }
        .sign-off strong {
            color: #0f172a;
            display: block;
            margin-top: 4px;
            font-size: 15px;
        }
        .sign-off span {
            color: #64748b;
            font-size: 13px;
        }
        .email-footer {
            background-color: #f8fafc;
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid #f1f5f9;
        }
        .email-footer p {
            margin: 0 0 6px;
            font-size: 12px;
            color: #94a3b8;
            line-height: 1.5;
        }
        .email-footer p:last-child {
            margin-bottom: 0;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- Header with MCDO Logo -->
            <div class="email-header">
                <div class="email-logo-box">
                    <?php if(file_exists(resource_path('Images/mcdologs.jpg'))): ?>
                        <img src="<?php echo e($message->embed(resource_path('Images/mcdologs.jpg'))); ?>" alt="MCDO Logo" class="email-logo">
                    <?php else: ?>
                        <div style="width:70px; height:70px; border-radius:50%; background:#ffffff; margin:0 auto; display:flex; align-items:center; justify-center; font-weight:bold; color:#1e3a8a;">MCDO</div>
                    <?php endif; ?>
                </div>
                <h1>Municipal Cooperative Development Office</h1>
                <p>Local Government Unit of Opol, Misamis Oriental</p>
                <div class="header-badge">Official Profiling System Notification</div>
            </div>

            <!-- Body -->
            <div class="email-body">
                <p class="greeting">
                    Dear <?php echo e($profile->chairperson ? $profile->chairperson : ($profile->name . ' Officers & Representatives')); ?>,
                </p>
                
                <p class="content-text">
                    This is an official confirmation from the Municipal Cooperative Development Office (MCDO). We are pleased to notify you that the profile record for <strong><?php echo e($profile->name); ?></strong> has been successfully 
                    <?php echo e(isset($action) && $action === 'updated' ? 'updated in' : 'attached and registered to'); ?> our municipal database.
                </p>

                <!-- Status Callout -->
                <div class="status-card">
                    <div class="status-title">
                        ✓ Cooperative Profile Successfully Registered
                    </div>
                    <p class="status-desc">
                        Your cooperative's information is now officially encoded in the MCDO system for regulatory compliance, municipal support programs, and community profiling.
                    </p>
                </div>

                <!-- Profile Summary Table -->
                <div class="details-table-wrapper">
                    <div class="details-table-title">Cooperative Profile Summary</div>
                    
                    <div class="details-row">
                        <span class="details-label">Cooperative Name:</span>
                        <span class="details-value"><?php echo e($profile->name); ?></span>
                    </div>
                    <div class="details-row">
                        <span class="details-label">CDA Reg. Number:</span>
                        <span class="details-value"><?php echo e($profile->cda_registration_no); ?></span>
                    </div>
                    <div class="details-row">
                        <span class="details-label">Cooperative Sector:</span>
                        <span class="details-value"><?php echo e($profile->coop_type); ?></span>
                    </div>
                    <div class="details-row">
                        <span class="details-label">Barangay Location:</span>
                        <span class="details-value"><?php echo e($profile->barangay); ?></span>
                    </div>
                    <?php if($profile->chairperson): ?>
                    <div class="details-row">
                        <span class="details-label">Chairperson:</span>
                        <span class="details-value"><?php echo e($profile->chairperson); ?></span>
                    </div>
                    <?php endif; ?>
                    <div class="details-row">
                        <span class="details-label">Compliance Status:</span>
                        <span class="details-value">
                            <span class="badge-compliant"><?php echo e($profile->compliance_status ?: 'Compliant'); ?></span>
                        </span>
                    </div>
                    <div class="details-row">
                        <span class="details-label">Date Processed:</span>
                        <span class="details-value"><?php echo e(date('F j, Y')); ?></span>
                    </div>
                </div>

                <p class="content-text">
                    If any adjustments or document renewals are required in the future, you may update your profile or reach out to our office directly. Thank you for your continued dedication to cooperative development in Opol!
                </p>

                <div class="sign-off">
                    Respectfully yours,
                    <strong>Municipal Cooperative Development Office (MCDO)</strong>
                    <span>LGU Opol, Misamis Oriental</span>
                </div>
            </div>

            <!-- Footer -->
            <div class="email-footer">
                <p>This is an automated system notification from the LGU Opol Cooperative Profiling Platform.</p>
                <p>&copy; <?php echo e(date('Y')); ?> Municipal Cooperative Development Office - Opol. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
<?php /**PATH C:\Users\User\mcdo\resources\views/emails/cooperative-profile-saved.blade.php ENDPATH**/ ?>