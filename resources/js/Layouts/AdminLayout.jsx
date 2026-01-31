// MOHAMED HASSANIN (KAPAKA)
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function AdminLayout({ children, title }) {
    const { auth, locale, flash, notifications } = usePage().props;
    const user = auth?.user;
    const notificationRef = useRef(null);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleClick = (event) => {
            if (!notificationRef.current?.contains(event.target)) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const q = params.get('q') || '';
            setSearchQuery(q);
        } catch {
            setSearchQuery('');
        }
    }, []);

    const labels = {
        dashboard: locale === 'ar' ? 'لوحة التحكم' : 'Dashboard',
        services: locale === 'ar' ? 'الخدمات' : 'Services',
        projects: locale === 'ar' ? 'المشاريع' : 'Projects',
        posts: locale === 'ar' ? 'المدونات' : 'Posts',
        categories: locale === 'ar' ? 'التصنيفات' : 'Categories',
        tags: locale === 'ar' ? 'الوسوم' : 'Tags',
        comments: locale === 'ar' ? 'تعليقات المدونة' : 'Comments',
        testimonials: locale === 'ar' ? 'آراء العملاء' : 'Testimonials',
        partners: locale === 'ar' ? 'الشركاء والعملاء' : 'Partners',
        settings: locale === 'ar' ? 'إعدادات الموقع' : 'Site Settings',
        contacts: locale === 'ar' ? 'رسائل التواصل' : 'Contact Messages',
        users: locale === 'ar' ? 'المستخدمون' : 'Users',
        activity: locale === 'ar' ? 'سجل النشاط' : 'Activity Logs',
        loginAttempts: locale === 'ar' ? 'محاولات الدخول' : 'Login Attempts',
        contentTools: locale === 'ar' ? 'أدوات المحتوى' : 'Content Tools',
        newsletter: locale === 'ar' ? 'النشرة البريدية' : 'Newsletter',
        webhooks: locale === 'ar' ? 'Webhooks' : 'Webhooks',
        search: locale === 'ar' ? 'بحث سريع' : 'Quick Search',
        notifications: locale === 'ar' ? 'الإشعارات' : 'Notifications',
    };

    const navItems = useMemo(() => {
        const items = [
            {
                label: labels.dashboard,
                href: route('admin.dashboard'),
                icon: 'bi-speedometer2',
                active: route().current('admin.dashboard'),
            },
            {
                label: labels.services,
                href: route('admin.services.index'),
                icon: 'bi-grid',
                active: route().current('admin.services.*'),
            },
            {
                label: labels.projects,
                href: route('admin.projects.index'),
                icon: 'bi-kanban',
                active: route().current('admin.projects.*'),
            },
            {
                label: labels.posts,
                href: route('admin.posts.index'),
                icon: 'bi-journal-text',
                active: route().current('admin.posts.*'),
            },
            {
                label: labels.categories,
                href: route('admin.categories.index'),
                icon: 'bi-folder2',
                active: route().current('admin.categories.*'),
            },
            {
                label: labels.tags,
                href: route('admin.tags.index'),
                icon: 'bi-tags',
                active: route().current('admin.tags.*'),
            },
            {
                label: labels.comments,
                href: route('admin.comments.index'),
                icon: 'bi-chat-left-text',
                active: route().current('admin.comments.*'),
            },
            {
                label: labels.testimonials,
                href: route('admin.testimonials.index'),
                icon: 'bi-chat-quote',
                active: route().current('admin.testimonials.*'),
            },
            {
                label: labels.partners,
                href: route('admin.partners.index'),
                icon: 'bi-people',
                active: route().current('admin.partners.*'),
            },
            {
                label: labels.contacts,
                href: route('admin.contacts.index'),
                icon: 'bi-inbox',
                active: route().current('admin.contacts.*'),
            },
            {
                label: labels.settings,
                href: route('admin.settings.edit'),
                icon: 'bi-gear',
                active: route().current('admin.settings.*'),
            },
        ];

        if (user?.role === 'admin') {
            items.push(
                {
                    label: labels.users,
                    href: route('admin.users.index'),
                    icon: 'bi-person-gear',
                    active: route().current('admin.users.*'),
                },
                {
                    label: labels.activity,
                    href: route('admin.activity.index'),
                    icon: 'bi-clock-history',
                    active: route().current('admin.activity.*'),
                },
                {
                    label: labels.loginAttempts,
                    href: route('admin.login-attempts.index'),
                    icon: 'bi-shield-exclamation',
                    active: route().current('admin.login-attempts.*'),
                },
                {
                    label: labels.contentTools,
                    href: route('admin.content-tools.index'),
                    icon: 'bi-box-seam',
                    active: route().current('admin.content-tools.*'),
                },
                {
                    label: labels.newsletter,
                    href: route('admin.newsletter-subscribers.index'),
                    icon: 'bi-envelope-paper',
                    active: route().current('admin.newsletter-subscribers.*'),
                },
                {
                    label: labels.webhooks,
                    href: route('admin.webhooks.index'),
                    icon: 'bi-broadcast',
                    active: route().current('admin.webhooks.*'),
                },
            );
        }

        return items;
    }, [labels, user?.role]);

    const unreadCount = notifications?.unread_count || 0;

    const submitSearch = (event) => {
        event.preventDefault();
        if (!searchQuery.trim()) {
            return;
        }
        router.get(
            route('admin.search'),
            { q: searchQuery },
            { preserveState: true, replace: true },
        );
    };

    return (
        <div className="admin-shell">
            <div className="d-flex flex-column flex-lg-row min-vh-100">
                <aside className="admin-sidebar p-4">
                    <Link
                        className="navbar-brand text-white mb-4"
                        href={route('admin.dashboard')}
                    >
                        <span className="brand-dot"></span>
                        <span>{title || 'Admin'}</span>
                    </Link>
                    <nav className="nav flex-column">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                className={`nav-link ${item.active ? 'active' : ''}`}
                                href={item.href}
                            >
                                <i className={`bi ${item.icon} me-2`}></i>
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <div className="flex-grow-1">
                    <div className="admin-topbar px-4 py-3 d-flex flex-wrap align-items-center justify-content-between">
                        <div>
                            <h4 className="mb-0">{title}</h4>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <form className="admin-search" onSubmit={submitSearch}>
                                <div className="input-group input-group-sm">
                                    <input
                                        type="search"
                                        className="form-control"
                                        placeholder={
                                            locale === 'ar'
                                                ? 'ابحث في لوحة التحكم...'
                                                : 'Search the dashboard...'
                                        }
                                        value={searchQuery}
                                        onChange={(event) =>
                                            setSearchQuery(event.target.value)
                                        }
                                        aria-label={labels.search}
                                    />
                                    <button className="btn btn-outline-secondary" type="submit">
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>
                            </form>
                            <div className="admin-notifications" ref={notificationRef}>
                                <button
                                    className="btn btn-sm btn-outline-dark position-relative"
                                    type="button"
                                    onClick={() =>
                                        setNotificationsOpen(!notificationsOpen)
                                    }
                                    aria-label={labels.notifications}
                                >
                                    <i className="bi bi-bell"></i>
                                    {unreadCount > 0 && (
                                        <span className="admin-notifications__badge">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                <div
                                    className={`admin-notifications__dropdown ${
                                        notificationsOpen ? 'is-open' : ''
                                    }`}
                                >
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="fw-semibold">
                                            {labels.notifications}
                                        </span>
                                        <Link
                                            className="btn btn-sm btn-outline-secondary"
                                            href={route('admin.notifications.read-all')}
                                            method="post"
                                            as="button"
                                        >
                                            {locale === 'ar'
                                                ? 'تحديد الكل كمقروء'
                                                : 'Mark all read'}
                                        </Link>
                                    </div>
                                    {notifications?.items?.length ? (
                                        <div className="admin-notifications__list">
                                            {notifications.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className={`admin-notifications__item ${
                                                        item.read_at
                                                            ? ''
                                                            : 'is-unread'
                                                    }`}
                                                >
                                                    <div className="small text-muted">
                                                        {item.created_at}
                                                    </div>
                                                    <div className="fw-semibold">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-muted small">
                                                        {item.body}
                                                    </div>
                                                    <div className="d-flex gap-2 mt-2">
                                                        {item.link && (
                                                            <Link
                                                                className="btn btn-sm btn-outline-primary"
                                                                href={item.link}
                                                            >
                                                                {locale === 'ar'
                                                                    ? 'عرض'
                                                                    : 'View'}
                                                            </Link>
                                                        )}
                                                        <Link
                                                            className="btn btn-sm btn-outline-secondary"
                                                            href={route(
                                                                'admin.notifications.read',
                                                                { notification: item.id },
                                                            )}
                                                            method="post"
                                                            as="button"
                                                        >
                                                            {locale === 'ar'
                                                                ? 'تمت القراءة'
                                                                : 'Mark read'}
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-muted small">
                                            {locale === 'ar'
                                                ? 'لا توجد إشعارات جديدة.'
                                                : 'No notifications yet.'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className="text-muted small">{user?.name}</span>
                            <Link
                                className="btn btn-sm btn-outline-dark"
                                href={route('logout')}
                                method="post"
                                as="button"
                            >
                                {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                            </Link>
                        </div>
                    </div>
                    <div className="p-4">
                        {flash?.success && (
                            <div className="alert alert-success">{flash.success}</div>
                        )}
                        {flash?.error && (
                            <div className="alert alert-danger">{flash.error}</div>
                        )}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
