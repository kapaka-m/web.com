{{-- MOHAMED HASSANIN (KAPAKA) --}}
<!DOCTYPE html>
<html lang="{{ $locale }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $locale === 'ar' ? '????? ????????' : 'Confirm Subscription' }}</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f6f6f6; padding:24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr>
            <td style="padding:24px;">
                <h2 style="margin:0 0 12px;">
                    {{ $locale === 'ar' ? '????? ???????? ?? ?????? ????????' : 'Confirm your subscription' }}
                </h2>
                <p style="margin:0 0 16px;">
                    {{ $locale === 'ar'
                        ? '???? ????? ??????? ??? ????? ??? ???? ??????.'
                        : 'Please confirm your subscription by clicking the button below.' }}
                </p>
                <p style="margin:0 0 24px;">
                    <a href="{{ route('newsletter.confirm', ['locale' => $locale, 'token' => $subscriber->token]) }}"
                       style="display:inline-block;padding:12px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px;">
                        {{ $locale === 'ar' ? '????? ????????' : 'Confirm subscription' }}
                    </a>
                </p>
                <p style="margin:0;color:#6b7280;font-size:14px;">
                    {{ $locale === 'ar'
                        ? '??? ?? ???? ????????? ????? ????? ??? ???????.'
                        : 'If you did not request this, you can safely ignore this email.' }}
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
