# Web.com Portfolio CMS

Multilingual portfolio and CMS built with Laravel 12 + React (Inertia),
Bootstrap 5, and Tailwind. RTL/LTR ready.

---

### Repository Description (EN)

Multilingual portfolio CMS built with Laravel 12 + React (Inertia). RTL/LTR ready, blog, projects, services, and a full admin panel with SEO tools.

### وصف المستودع (AR)

منصة بورتفوليو متعددة اللغات مبنية بـ Laravel 12 وReact (Inertia). تدعم RTL/LTR وبها مدونة ومشاريع وخدمات ولوحة تحكم كاملة مع أدوات SEO.

### Suggested Topics

`laravel` `react` `inertiajs` `portfolio` `cms` `bootstrap` `tailwind` `rtl` `multilingual` `seo`

### Upload Steps

1. `git init`
2. `git add .`
3. `git commit -m "Initial commit"`
4. `git branch -M main`
5. `git remote add origin YOUR_REPO_URL`
6. `git push -u origin main`

## English

### Project Summary

A full-stack portfolio and content platform with a public website and a
complete admin CMS. It supports Arabic/English, RTL/LTR layouts, and
content workflows suitable for professional personal or agency websites.

### Tech Stack

#### Backend

- PHP 8.2+, Laravel 12, Eloquent ORM
- MySQL (default), Redis optional
- Auth: Laravel Breeze, Sanctum

#### Frontend

- React 18, Inertia.js
- Bootstrap 5 + Tailwind CSS
- Vite 7

#### Tooling

- ESLint + Prettier
- PHPUnit, Playwright E2E
- Telescope (dev), Sentry/Bugsnag (optional)
- Webhooks, newsletter integrations

### Project Specs and Size

- Scope: Medium-to-large (multi-module CMS + admin + integrations).
- Content models: Services, Projects, Posts, Categories, Tags,
  Testimonials, Partners, Comments, Contact Messages, Newsletter
  Subscribers, Webhooks, Users, Site Settings.
- Hosting: works on shared hosting or VPS.
- Usage: personal portfolio, agency site, consultancy, product showcase,
  or content marketing hub.

### Key Features

- Public site: home, services, projects, about, blog, contact, careers,
  consulting, privacy/terms
- Blog: categories, tags, comments, RSS, news sitemap
- Multi-step contact form with captcha, DB storage, and email to
  `CONTACT_TO_EMAIL`
- Bilingual content fields and RTL/LTR layouts
- Admin CMS with roles (Admin/Editor), soft delete/restore, scheduled
  publish, review workflow
- Rich editor: markdown alternative, gallery block, code block, autosave,
  preview
- SEO per page: meta title/description, OG image, canonical, robots
- Activity logs with diffs, login attempts log, notifications
- Search, import/export CSV/JSON
- Backups and health endpoint

### Admin Notes

- The first registered user becomes **Admin**; others default to **Editor**.
- Content settings and integrations are configurable from the admin panel.

### SEO and Structured Data

- Open Graph + Twitter cards
- Structured data for Services, Projects, Person/Organization
- Canonical URLs (UTM-safe)
- Sitemaps per language, RSS, news sitemap

### Media and Performance

- Lazy loading with blur
- Responsive images via srcset
- Server-side image compression, optional watermark, optional AV scan
- CDN-friendly image URLs and cache headers

### Security

- CSP and security headers (HSTS)
- Captcha (hCaptcha or Turnstile)
- File validation (MIME) and optional AV scan
- Rate limiting for contact/comments
- Secrets support: env, Vault, AWS Secrets Manager
- Audit logs and failed login tracking

### Integrations and Monitoring

- SMTP from admin settings
- Webhooks on publish
- Telegram/Slack alerts
- Newsletter integrations (Mailchimp/Sendinblue)
- Calendly booking and chat widgets
- Telescope (dev), Sentry/Bugsnag
- Health endpoint for uptime checks

### Sitemap

#### Global

- `/sitemap.xml`
- `/sitemap-{locale}.xml`
- `/health`

#### Public (locale-based)

- `/{locale}/`
- `/{locale}/services`
- `/{locale}/services/{slug}`
- `/{locale}/projects`
- `/{locale}/projects/{slug}`
- `/{locale}/about`
- `/{locale}/blog`
- `/{locale}/blog/{slug}`
- `/{locale}/privacy-policy`
- `/{locale}/terms-of-use`
- `/{locale}/contact`
- `/{locale}/careers`
- `/{locale}/consulting`
- `/{locale}/rss.xml`
- `/{locale}/news-sitemap.xml`
- `/{locale}/newsletter/confirm/{token}`
- `/{locale}/newsletter/unsubscribe/{token}`

#### Admin (protected, `/admin`)

- `/admin`
- `/admin/services`, `/admin/projects`, `/admin/posts`
- `/admin/categories`, `/admin/tags`
- `/admin/testimonials`, `/admin/partners`
- `/admin/comments`, `/admin/contacts`
- `/admin/settings`
- `/admin/users`
- `/admin/activity-logs`, `/admin/login-attempts`
- `/admin/webhooks`, `/admin/newsletter-subscribers`
- `/admin/search`, `/admin/content-tools`

### Local and Testing Setup

1. Requirements: PHP 8.2+, Composer, Node 20.19+ (or 22+), MySQL 8+.
2. Install: `composer install` and `npm install`.
3. Configure `.env` for local/testing (already prepared).
4. Generate key if missing: `php artisan key:generate`.
5. Migrate/seed: `php artisan migrate --seed`.
6. Run: `npm run dev` and `php artisan serve`.
7. Optional: `php artisan queue:work` and a scheduler.

### Production Deployment

- Use `.env.example` as a production template, copy to `.env`, and fill
  real values.

#### Commands

- `composer install --no-dev --optimize-autoloader`
- `npm ci`
- `npm run build`
- `php artisan migrate --force`
- `php artisan storage:link`
- `php artisan config:cache && php artisan route:cache && php artisan view:cache`

- Web root should be `public/`.
- Run a queue worker and the scheduler for publishing/backup jobs.
- Set `APP_ENV=production` and `APP_DEBUG=false`.

### Tests

- PHP: `php artisan test`
- E2E: `npm run test:e2e`

### Ratings (baseline, out of 10)

| Area | Score | Notes |
| --- | --- | --- |
| Frontend | 8.5 | React + Bootstrap/Tailwind, RTL/LTR |
| Backend | 9.0 | Laravel 12, policies, workflows |
| Fullstack | 8.8 | Solid integration via Inertia |
| DevOps | 7.8 | Health checks, backups, env-driven |
| Security | 8.6 | CSP, captcha, file checks, logs |
| QA | 7.5 | PHPUnit + Playwright available |
| Test | 7.5 | Base tests in place, expandable |
| Optimization | 8.2 | Caching, responsive images |
| UI | 8.4 | Clean, modern, responsive |
| UX | 8.3 | Multi-step flows, bilingual |
| Design | 8.4 | Consistent layout system |
| User | 8.2 | Good public UX |
| Admin | 8.7 | Strong CMS workflows |

---

## العربية

### ملخص المشروع

منصة بورتفوليو ونظام إدارة محتوى متكامل بواجهة عامة ولوحة تحكم. تدعم
العربية والإنجليزية مع اتجاهي RTL/LTR، ومناسبة لمواقع شخصية أو شركات
ووكالات.

### التقنيات المستخدمة

#### الخلفية (Backend)

- PHP 8.2+ وLaravel 12 مع Eloquent ORM
- MySQL (افتراضي) مع دعم Redis اختياريا
- المصادقة: Laravel Breeze وSanctum

#### الواجهة (Frontend)

- React 18 وInertia.js
- Bootstrap 5 + Tailwind CSS
- Vite 7

#### الأدوات

- ESLint + Prettier
- PHPUnit وPlaywright للاختبارات
- Telescope في التطوير وSentry/Bugsnag اختياريا
- Webhooks وتكاملات النشرة البريدية

### مواصفات وحجم المشروع

- الحجم: متوسط إلى كبير (CMS متعدد الوحدات ولوحة تحكم وتكاملات).
- نماذج المحتوى: خدمات، مشاريع، مقالات، تصنيفات، وسوم، آراء العملاء،
  شركاء، تعليقات، رسائل تواصل، مشتركون، Webhooks، مستخدمون، إعدادات
  الموقع.
- الاستضافة: يصلح لاستضافة مشتركة أو VPS.
- الاستخدام: بورتفوليو شخصي، موقع شركة أو وكالة، استشارات، عرض منتجات،
  أو مدونة احترافية.

### المزايا الرئيسية

- واجهة عامة: الرئيسية، الخدمات، المشاريع، من أنا، المدونة، تواصل، فرص
  عمل، استشارات، الخصوصية والشروط
- المدونة: تصنيفات، وسوم، تعليقات، RSS وNews Sitemap
- نموذج تواصل متعدد الخطوات مع Captcha وحفظ الرسائل وإرسالها إلى
  `CONTACT_TO_EMAIL`
- حقول محتوى ثنائية اللغة مع دعم RTL/LTR
- لوحة تحكم بصلاحيات (Admin/Editor) مع Soft Delete واسترجاع وجدولة
  ونظام مراجعة
- محرر متقدم: بديل Markdown، معرض صور، بلوك كود، حفظ تلقائي ومعاينة
- SEO لكل صفحة: عناوين/وصف، OG Image، Canonical، Robots
- سجل نشاط مع فروقات، سجل محاولات الدخول، وإشعارات
- بحث، واستيراد/تصدير CSV/JSON
- نسخ احتياطية وHealth Endpoint

### ملاحظات لوحة التحكم

- أول مستخدم يسجل يصبح **Admin** والباقي **Editor**.
- إعدادات الموقع والتكاملات قابلة للتحكم من لوحة التحكم.

### SEO والبيانات المنظمة

- بطاقات Open Graph وTwitter
- Structured Data للخدمات والمشاريع وPerson/Organization
- روابط Canonical مع استثناء UTM
- خرائط موقع متعددة اللغات وRSS وNews Sitemap

### الصور والأداء

- Lazy Loading مع تأثير Blur
- صور Responsive عبر srcset
- ضغط صور أثناء الرفع مع علامة مائية اختيارية وفحص AV اختياري
- دعم CDN مع Cache Headers

### الأمان

- CSP وSecurity Headers مع HSTS
- Captcha (hCaptcha أو Turnstile)
- فحص نوع الملفات (MIME) وفحص AV اختياري
- Rate Limiting للتواصل والتعليقات
- Secrets عبر env أو Vault أو AWS
- سجلات تدقيق ومحاولات دخول فاشلة

### التكاملات والمراقبة

- SMTP من لوحة التحكم
- Webhooks عند نشر المحتوى
- تنبيهات Telegram/Slack
- تكاملات Newsletter (Mailchimp/Sendinblue)
- حجز مواعيد Calendly وChat Widgets
- Telescope للتطوير وSentry/Bugsnag
- Health Endpoint لمراقبة Uptime

### خريطة الموقع

#### عام

- `/sitemap.xml`
- `/sitemap-{locale}.xml`
- `/health`

#### الواجهة العامة (حسب اللغة)

- `/{locale}/`
- `/{locale}/services`
- `/{locale}/services/{slug}`
- `/{locale}/projects`
- `/{locale}/projects/{slug}`
- `/{locale}/about`
- `/{locale}/blog`
- `/{locale}/blog/{slug}`
- `/{locale}/privacy-policy`
- `/{locale}/terms-of-use`
- `/{locale}/contact`
- `/{locale}/careers`
- `/{locale}/consulting`
- `/{locale}/rss.xml`
- `/{locale}/news-sitemap.xml`
- `/{locale}/newsletter/confirm/{token}`
- `/{locale}/newsletter/unsubscribe/{token}`

#### لوحة التحكم (محمي، `/admin`)

- `/admin`
- `/admin/services`, `/admin/projects`, `/admin/posts`
- `/admin/categories`, `/admin/tags`
- `/admin/testimonials`, `/admin/partners`
- `/admin/comments`, `/admin/contacts`
- `/admin/settings`
- `/admin/users`
- `/admin/activity-logs`, `/admin/login-attempts`
- `/admin/webhooks`, `/admin/newsletter-subscribers`
- `/admin/search`, `/admin/content-tools`

### تشغيل محلي واختبارات

1. المتطلبات: PHP 8.2+ وComposer وNode 20.19+ (أو 22+) وMySQL 8+.
2. التثبيت: `composer install` و`npm install`.
3. ضبط ملف `.env` للاختبار والتجربة (جاهز).
4. إنشاء مفتاح: `php artisan key:generate`.
5. المايجريشن والبذور: `php artisan migrate --seed`.
6. التشغيل: `npm run dev` و`php artisan serve`.
7. اختياري: `php artisan queue:work` ومجدول المهام.

### تشغيل للإنتاج والنشر

- استخدم `.env.example` كقالب للإنتاج، انسخه إلى `.env` وضع القيم
  الحقيقية.

#### الأوامر

- `composer install --no-dev --optimize-autoloader`
- `npm ci`
- `npm run build`
- `php artisan migrate --force`
- `php artisan storage:link`
- `php artisan config:cache && php artisan route:cache && php artisan view:cache`

- جذر الموقع يجب أن يكون `public/`.
- شغل Queue Worker ومجدول المهام للنشر المجدول والنسخ الاحتياطي.
- اضبط `APP_ENV=production` و`APP_DEBUG=false`.

### الاختبارات

- اختبارات PHP: `php artisan test`
- اختبارات E2E: `npm run test:e2e`

### التقييمات (Baseline من 10)

| المجال | التقييم | ملاحظات |
| --- | --- | --- |
| Frontend | 8.5 | React + Bootstrap/Tailwind ودعم RTL/LTR |
| Backend | 9.0 | Laravel 12 وصلاحيات وسير عمل |
| Fullstack | 8.8 | تكامل قوي عبر Inertia |
| DevOps | 7.8 | فحص صحة ونسخ احتياطية وإعدادات مرنة |
| Security | 8.6 | CSP وCaptcha وفحص ملفات وسجلات |
| QA | 7.5 | PHPUnit وPlaywright متاحان |
| Test | 7.5 | أساس جيد ويمكن التوسع |
| Optimization | 8.2 | كاش وصور Responsive |
| UI | 8.4 | واجهة حديثة ومتجاوبة |
| UX | 8.3 | خطوات واضحة ودعم ثنائي اللغة |
| Design | 8.4 | هوية متناسقة |
| User | 8.2 | تجربة مستخدم جيدة |
| Admin | 8.7 | لوحة قوية وسير عمل متكامل |
