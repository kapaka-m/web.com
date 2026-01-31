<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewsletterConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public NewsletterSubscriber $subscriber)
    {
    }

    public function build(): self
    {
        $locale = $this->subscriber->locale ?: config('app.locale');
        $subject = $locale === 'ar'
            ? 'تأكيد الاشتراك في النشرة البريدية'
            : 'Confirm your newsletter subscription';

        return $this->subject($subject)
            ->view('emails.newsletter-confirmation')
            ->with([
                'subscriber' => $this->subscriber,
                'locale' => $locale,
            ]);
    }
}
