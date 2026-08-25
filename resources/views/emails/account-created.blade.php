<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Successfully Created</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626, #2563eb); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">MCDO Opol</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Municipal Cooperative Development Office</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Account Successfully Created!</h2>
            
            <p>Dear {{ $user->name ?? 'User' }},</p>
            
            <p>We are pleased to inform you that your account has been successfully created and is now ready to use.</p>
            
            <div style="background: white; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0;"><strong>Your Account Details:</strong></p>
                <p style="margin: 5px 0 0 0;"><strong>Email:</strong> {{ $user->email }}</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">Active</span></p>
            </div>
            
            <p>You can now access the MCDO Opol Cooperative Management System using your credentials.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ url('/dashboard') }}" style="display: inline-block; background: linear-gradient(135deg, #dc2626, #2563eb); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Access Dashboard</a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">If you did not create this account, please contact us immediately.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                &copy; {{ date('Y') }} MCDO Opol. All rights reserved.<br>
                This is an automated email. Please do not reply.
            </p>
        </div>
    </div>
</body>
</html>
