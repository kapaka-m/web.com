<?php
// MOHAMED HASSANIN (KAPAKA)

namespace App\Providers;

use App\Models\Category;
use App\Models\Comment;
use App\Models\ContactMessage;
use App\Models\Partner;
use App\Models\Post;
use App\Models\Project;
use App\Models\NewsletterSubscriber;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Tag;
use App\Models\Testimonial;
use App\Models\User;
use App\Models\WebhookEndpoint;
use App\Policies\CategoryPolicy;
use App\Policies\CommentPolicy;
use App\Policies\ContactMessagePolicy;
use App\Policies\PartnerPolicy;
use App\Policies\PostPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\NewsletterSubscriberPolicy;
use App\Policies\ServicePolicy;
use App\Policies\SiteSettingPolicy;
use App\Policies\TagPolicy;
use App\Policies\TestimonialPolicy;
use App\Policies\UserPolicy;
use App\Policies\WebhookEndpointPolicy;
use App\Listeners\LogFailedLogin;
use App\Support\MailSettings;
use Illuminate\Auth\Events\Failed;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::policy(Service::class, ServicePolicy::class);
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(Post::class, PostPolicy::class);
        Gate::policy(Category::class, CategoryPolicy::class);
        Gate::policy(Tag::class, TagPolicy::class);
        Gate::policy(Testimonial::class, TestimonialPolicy::class);
        Gate::policy(Partner::class, PartnerPolicy::class);
        Gate::policy(Comment::class, CommentPolicy::class);
        Gate::policy(ContactMessage::class, ContactMessagePolicy::class);
        Gate::policy(NewsletterSubscriber::class, NewsletterSubscriberPolicy::class);
        Gate::policy(WebhookEndpoint::class, WebhookEndpointPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(SiteSetting::class, SiteSettingPolicy::class);

        Event::listen(Failed::class, LogFailedLogin::class);

        MailSettings::apply();
    }
}
