<?php
// MOHAMED HASSANIN (KAPAKA)

use App\Http\Controllers\Admin\ActivityLogController as AdminActivityLogController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CommentController as AdminCommentController;
use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\LoginAttemptController as AdminLoginAttemptController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Admin\PartnerController as AdminPartnerController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\SiteSettingController as AdminSiteSettingController;
use App\Http\Controllers\Admin\TagController as AdminTagController;
use App\Http\Controllers\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\SearchController as AdminSearchController;
use App\Http\Controllers\Admin\ContentToolsController as AdminContentToolsController;
use App\Http\Controllers\Admin\TranslationController as AdminTranslationController;
use App\Http\Controllers\Admin\NewsletterSubscriberController as AdminNewsletterSubscriberController;
use App\Http\Controllers\Admin\WebhookEndpointController as AdminWebhookEndpointController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Site\AboutController;
use App\Http\Controllers\Site\BlogController;
use App\Http\Controllers\Site\CareersController;
use App\Http\Controllers\Site\CommentController;
use App\Http\Controllers\Site\ContactController;
use App\Http\Controllers\Site\ConsultingController;
use App\Http\Controllers\Site\HomeController;
use App\Http\Controllers\Site\LegalController;
use App\Http\Controllers\Site\NewsSitemapController;
use App\Http\Controllers\Site\NewsletterController;
use App\Http\Controllers\Site\ProjectsController;
use App\Http\Controllers\Site\RssController;
use App\Http\Controllers\Site\ServicesController;
use App\Http\Controllers\Site\SitemapController;
use App\Http\Controllers\HealthController;
use Illuminate\Support\Facades\Route;

$localePattern = implode('|', config('app.supported_locales', ['ar', 'en']));

Route::redirect('/', '/' . config('app.locale'));
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/sitemap-{locale}.xml', [SitemapController::class, 'locale'])
    ->where(['locale' => $localePattern])
    ->name('sitemap.locale');
Route::get('/health', HealthController::class)->name('health');

Route::prefix('{locale}')
    ->where(['locale' => $localePattern])
    ->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('home');
        Route::get('/services', [ServicesController::class, 'index'])->name('services.index');
        Route::get('/services/{service:slug}', [ServicesController::class, 'show'])->name('services.show');
        Route::get('/projects', [ProjectsController::class, 'index'])->name('projects.index');
        Route::get('/projects/{project:slug}', [ProjectsController::class, 'show'])->name('projects.show');
        Route::get('/about', [AboutController::class, 'index'])->name('about');
        Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
        Route::get('/blog/{post:slug}', [BlogController::class, 'show'])->name('blog.show');
        Route::post('/blog/{post:slug}/comments', [CommentController::class, 'store'])
            ->name('blog.comments.store')
            ->middleware('throttle:6,1');
        Route::get('/privacy-policy', [LegalController::class, 'privacy'])->name('privacy');
        Route::get('/terms-of-use', [LegalController::class, 'terms'])->name('terms');
        Route::get('/rss.xml', [RssController::class, 'index'])->name('rss');
        Route::get('/news-sitemap.xml', [NewsSitemapController::class, 'index'])->name('news-sitemap');
        Route::get('/contact', [ContactController::class, 'create'])->name('contact');
        Route::post('/contact', [ContactController::class, 'store'])->name('contact.store')->middleware('throttle:10,1');
        Route::post('/newsletter', [NewsletterController::class, 'store'])->name('newsletter.store');
        Route::get('/newsletter/confirm/{token}', [NewsletterController::class, 'confirm'])
            ->name('newsletter.confirm');
        Route::get('/newsletter/unsubscribe/{token}', [NewsletterController::class, 'unsubscribe'])
            ->name('newsletter.unsubscribe');
        Route::get('/careers', [CareersController::class, 'index'])->name('careers');
        Route::get('/consulting', [ConsultingController::class, 'index'])->name('consulting');
    });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified', 'role:admin,editor'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::post('posts/autosave', [AdminPostController::class, 'autosave'])->name('posts.autosave');
        Route::post('posts/{post}/autosave', [AdminPostController::class, 'autosaveExisting'])
            ->name('posts.autosave-existing');
        Route::get('posts/{post}/preview', [AdminPostController::class, 'preview'])->name('posts.preview');
        Route::put('posts/{post}/restore', [AdminPostController::class, 'restore'])->name('posts.restore');
        Route::resource('services', AdminServiceController::class)->except(['show']);
        Route::put('services/{service}/restore', [AdminServiceController::class, 'restore'])->name('services.restore');
        Route::resource('categories', AdminCategoryController::class)->except(['show']);
        Route::put('categories/{category}/restore', [AdminCategoryController::class, 'restore'])->name('categories.restore');
        Route::resource('tags', AdminTagController::class)->except(['show']);
        Route::put('tags/{tag}/restore', [AdminTagController::class, 'restore'])->name('tags.restore');
        Route::resource('projects', AdminProjectController::class)->except(['show']);
        Route::put('projects/{project}/restore', [AdminProjectController::class, 'restore'])->name('projects.restore');
        Route::resource('posts', AdminPostController::class)->except(['show']);
        Route::resource('testimonials', AdminTestimonialController::class)->except(['show']);
        Route::put('testimonials/{testimonial}/restore', [AdminTestimonialController::class, 'restore'])
            ->name('testimonials.restore');
        Route::resource('partners', AdminPartnerController::class)->except(['show']);
        Route::put('partners/{partner}/restore', [AdminPartnerController::class, 'restore'])
            ->name('partners.restore');
        Route::resource('comments', AdminCommentController::class)
            ->only(['index', 'destroy']);
        Route::put('comments/{comment}/approve', [AdminCommentController::class, 'approve'])
            ->name('comments.approve');
        Route::put('comments/{comment}/restore', [AdminCommentController::class, 'restore'])
            ->name('comments.restore');
        Route::get('/settings', [AdminSiteSettingController::class, 'edit'])->name('settings.edit');
        Route::put('/settings', [AdminSiteSettingController::class, 'update'])->name('settings.update');
        Route::resource('contacts', AdminContactMessageController::class)
            ->only(['index', 'show', 'destroy']);
        Route::get('search', [AdminSearchController::class, 'index'])->name('search');
        Route::get('content-tools', [AdminContentToolsController::class, 'index'])->name('content-tools.index');
        Route::post('content-tools/export', [AdminContentToolsController::class, 'export'])->name('content-tools.export');
        Route::post('content-tools/import', [AdminContentToolsController::class, 'import'])->name('content-tools.import');
        Route::post('translate', [AdminTranslationController::class, 'translate'])->name('translate');
        Route::post('notifications/{notification}/read', [AdminNotificationController::class, 'markRead'])
            ->name('notifications.read');
        Route::post('notifications/read-all', [AdminNotificationController::class, 'markAllRead'])
            ->name('notifications.read-all');
    });

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('users', AdminUserController::class)->except(['show']);
        Route::get('/activity-logs', [AdminActivityLogController::class, 'index'])
            ->name('activity.index');
        Route::get('/login-attempts', [AdminLoginAttemptController::class, 'index'])
            ->name('login-attempts.index');
        Route::resource('webhooks', AdminWebhookEndpointController::class)->except(['show']);
        Route::resource('newsletter-subscribers', AdminNewsletterSubscriberController::class)
            ->only(['index', 'update', 'destroy']);
    });

require __DIR__ . '/auth.php';
