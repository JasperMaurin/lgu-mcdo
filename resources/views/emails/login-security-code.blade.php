<x-mail::message>
# New Browser Security Verification Code

A login attempt was initiated for your MCDO Opol account from a new browser or session.

Use the 6-digit security token below to authorize your login. It expires in 10 minutes.

<x-mail::panel>
<div style="font-size: 32px; font-weight: 800; letter-spacing: 0.3em; text-align: center; color: #1d4ed8;">{{ $code }}</div>
</x-mail::panel>

If you did not attempt to sign in, please secure your account immediately by changing your password.

Thanks,<br>
{{ config('app.name') }} — MCDO Opol
</x-mail::message>
