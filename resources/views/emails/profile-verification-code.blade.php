<x-mail::message>
# Confirm your {{ $changeType }} change

Use the code below to confirm your account change. It expires in 15 minutes.

<x-mail::panel>
<div style="font-size: 28px; font-weight: 700; letter-spacing: 0.25em; text-align: center;">{{ $code }}</div>
</x-mail::panel>

If you did not request this change, reset your password and contact the administrator immediately.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
