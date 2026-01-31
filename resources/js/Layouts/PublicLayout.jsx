// MOHAMED HASSANIN (KAPAKA)
import NewsletterForm from '@/Components/NewsletterForm';
import LocaleSwitcher from '@/Components/LocaleSwitcher';
import { Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function PublicLayout({ children, site }) {
    const { locale, auth, flash } = usePage().props;

    const isArabic = locale === 'ar';
    const t = (ar, en) => (isArabic ? ar : en);

    useEffect(() => {
        const chat = site?.integrations?.chat;
        if (!chat || chat.provider === 'none') {
            return;
        }

        if (chat.provider === 'crisp' && chat.crisp_website_id) {
            if (!document.getElementById('crisp-chat')) {
                window.$crisp = window.$crisp || [];
                window.CRISP_WEBSITE_ID = chat.crisp_website_id;

                const script = document.createElement('script');
                script.id = 'crisp-chat';
                script.src = 'https://client.crisp.chat/l.js';
                script.async = true;
                document.head.appendChild(script);
            }
            return;
        }

        if (chat.provider === 'intercom' && chat.intercom_app_id) {
            if (!document.getElementById('intercom-chat')) {
                window.intercomSettings = {
                    app_id: chat.intercom_app_id,
                };

                const script = document.createElement('script');
                script.id = 'intercom-chat';
                script.src = `https://widget.intercom.io/widget/${chat.intercom_app_id}`;
                script.async = true;
                document.head.appendChild(script);
            }
            return;
        }

        if (chat.provider === 'custom' && chat.custom_script) {
            if (!document.getElementById('custom-chat-script')) {
                const wrapper = document.createElement('div');
                wrapper.id = 'custom-chat-script';
                wrapper.innerHTML = chat.custom_script;
                document.body.appendChild(wrapper);
            }
        }
    }, [
        site?.integrations?.chat?.provider,
        site?.integrations?.chat?.crisp_website_id,
        site?.integrations?.chat?.intercom_app_id,
        site?.integrations?.chat?.custom_script,
    ]);

    const labels = {
        home: locale === 'ar' ? '????????' : 'Home',
        services: locale === 'ar' ? '???????' : 'Services',
        projects: locale === 'ar' ? '????????' : 'Projects',
        consulting: locale === 'ar' ? '??????????' : 'Consulting',
        about: locale === 'ar' ? '?? ???' : 'About',
        blog: locale === 'ar' ? '???????' : 'Blog',
        contact: locale === 'ar' ? '?????' : 'Contact',
        careers: locale === 'ar' ? '??? ?????' : 'Careers',
        dashboard: locale === 'ar' ? '???? ??????' : 'Dashboard',
        login: locale === 'ar' ? '????? ??????' : 'Login',
        privacy: locale === 'ar' ? '????? ????????' : 'Privacy Policy',
        terms: locale === 'ar' ? '???? ?????????' : 'Terms of Use',
        sitemap: locale === 'ar' ? '????? ??????' : 'Sitemap',
        rss: 'RSS',
        resources: locale === 'ar' ? '?????' : 'Resources',
        follow: locale === 'ar' ? '??????' : 'Follow',
        contactHeader: locale === 'ar' ? '?????' : 'Contact',
    };

    const navLinks = [
        {
            label: labels.home,
            href: route('home', { locale }),
            active: route().current('home'),
        },
        {
            label: labels.services,
            href: route('services.index', { locale }),
            active: route().current('services.*'),
        },
        {
            label: labels.projects,
            href: route('projects.index', { locale }),
            active: route().current('projects.*'),
        },
        {
            label: labels.consulting,
            href: route('consulting', { locale }),
            active: route().current('consulting'),
        },
        {
            label: labels.about,
            href: route('about', { locale }),
            active: route().current('about'),
        },
        {
            label: labels.blog,
            href: route('blog.index', { locale }),
            active: route().current('blog.*'),
        },
        {
            label: labels.contact,
            href: route('contact', { locale }),
            active: route().current('contact'),
        },
    ];

    const footerLinks = [
        { label: labels.consulting, href: route('consulting', { locale }) },
        { label: labels.careers, href: route('careers', { locale }) },
        { label: labels.privacy, href: route('privacy', { locale }) },
        { label: labels.terms, href: route('terms', { locale }) },
        { label: labels.sitemap, href: route('sitemap') },
        { label: labels.rss, href: route('rss', { locale }) },
    ];

    const brandName = site?.site_name || 'Website';
    const brandTagline = site?.tagline;
    const contactCta = t('???? ??????', 'Start a project');
    const projectsCta = t('?????? ???????', 'View work');
    const footerTitle = t('???? ????????', 'Ready to build together?');
    const footerSubtitle = t(
        '?????? ?? ????? ?????? ???? ???? ?????.',
        'Tell me about your idea and I will come back with a clear plan.',
    );
    const skipLabel = t('???? ??? ???????', 'Skip to content');
    const navLabel = t('?????? ???????', 'Main navigation');
    const footerLabel = t('????? ??????', 'Site footer');

    const emailValue = site?.contact?.email;
    const phoneValue = site?.contact?.phone;
    const locationValue = site?.contact?.location;
    const contactItems = [
        emailValue && {
            icon: 'bi-envelope',
            value: emailValue,
            href: `mailto:${emailValue}`,
        },
        phoneValue && {
            icon: 'bi-telephone',
            value: phoneValue,
            href: `tel:${phoneValue.replace(/\s+/g, '')}`,
        },
        locationValue && {
            icon: 'bi-geo-alt',
            value: locationValue,
        },
    ].filter(Boolean);

    return (
        <div id="top" className="d-flex min-vh-100 flex-column">
            <a className="skip-link" href="#main">
                {skipLabel}
            </a>
            <nav
                className="navbar navbar-expand-lg navbar-light sticky-top navbar--main"
                aria-label={navLabel}
            >
                <div className="container">
                    <Link className="navbar-brand" href={route('home', { locale })}>
                        <span className="brand-dot" aria-hidden="true"></span>
                        <span className="brand-name">{brandName}</span>
                        {brandTagline && (
                            <span className="brand-tagline d-none d-xl-inline">
                                {brandTagline}
                            </span>
                        )}
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#mainNavbar"
                        aria-controls="mainNavbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="mainNavbar">
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0 nav-main">
                            {navLinks.map((item) => (
                                <li className="nav-item" key={item.href}>
                                    <Link
                                        className={`nav-link ${
                                            item.active ? 'active nav-link--active' : ''
                                        }`}
                                        href={item.href}
                                        aria-current={item.active ? 'page' : undefined}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="navbar-actions d-flex align-items-center gap-2 ms-lg-3">
                            <LocaleSwitcher className="nav-locale" />
                            {auth?.user ? (
                                <Link
                                    className="btn btn-sm btn-outline-dark nav-ghost"
                                    href={route('admin.dashboard')}
                                >
                                    {labels.dashboard}
                                </Link>
                            ) : (
                                <Link
                                    className="btn btn-sm btn-outline-dark nav-ghost"
                                    href={route('login')}
                                >
                                    {labels.login}
                                </Link>
                            )}
                            <Link
                                className="btn btn-sm btn-primary nav-cta"
                                href={route('contact', { locale })}
                            >
                                {contactCta}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {flash?.success && (
                <div className="container mt-4">
                    <div className="alert alert-success">{flash.success}</div>
                </div>
            )}

            {flash?.error && (
                <div className="container mt-4">
                    <div className="alert alert-danger">{flash.error}</div>
                </div>
            )}

            <main className="flex-grow-1" id="main" tabIndex="-1">
                {children}
            </main>

            <footer className="footer mt-auto" aria-label={footerLabel}>
                <div className="container">
                    <div className="footer-cta">
                        <div>
                            <div className="footer-eyebrow">{footerTitle}</div>
                            <h3 className="footer-title">{footerSubtitle}</h3>
                        </div>
                        <div className="footer-cta-actions">
                            <Link
                                className="btn btn-primary"
                                href={route('contact', { locale })}
                            >
                                {contactCta}
                            </Link>
                            <Link
                                className="btn btn-outline-light"
                                href={route('projects.index', { locale })}
                            >
                                {projectsCta}
                            </Link>
                        </div>
                    </div>

                    <div className="footer-grid">
                        <div>
                            <div className="footer-brand">
                                <span className="brand-dot" aria-hidden="true"></span>
                                <span>{brandName}</span>
                            </div>
                            <p className="footer-text">{site?.tagline}</p>
                            {site?.footer_note && (
                                <p className="footer-note">{site.footer_note}</p>
                            )}
                            <div className="footer-socials">
                                {(site?.social_links || []).map((link) => (
                                    <a
                                        key={link.url}
                                        href={link.url}
                                        className="footer-social"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {link.icon && (
                                            <i className={`bi ${link.icon}`}></i>
                                        )}
                                        <span>{link.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="footer-heading">{labels.resources}</div>
                            <ul className="footer-links">
                                {footerLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href}>{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="footer-heading">
                                {locale === 'ar' ? '??????' : 'Navigation'}
                            </div>
                            <ul className="footer-links">
                                {navLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href}>{link.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="footer-heading">{labels.contactHeader}</div>
                            {contactItems.length > 0 ? (
                                <div className="footer-contact">
                                    {contactItems.map((item) => (
                                        <div key={item.icon}>
                                            <i className={`bi ${item.icon}`}></i>
                                            {item.href ? (
                                                <a href={item.href}>{item.value}</a>
                                            ) : (
                                                <span>{item.value}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="footer-note">
                                    {t(
                                        '?????? ??????? ?????? ??????.',
                                        'Contact details coming soon.',
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {site?.integrations?.newsletter?.enabled && (
                        <div className="footer-newsletter">
                            <NewsletterForm className="newsletter-form" />
                        </div>
                    )}

                    <div className="footer-bottom">
                        <span>
                            {t('???? ?????? ??????', 'All rights reserved')} ©{' '}
                            {new Date().getFullYear()} {brandName}
                        </span>
                        <a className="footer-top" href="#top">
                            {t('?????? ??????', 'Back to top')}
                            <i className="bi bi-arrow-up"></i>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
