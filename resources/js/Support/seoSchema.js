// MOHAMED HASSANIN (KAPAKA)
import { resolveAbsoluteUrl } from '@/Support/resolveImageUrl';

const normalizeString = (value) => {
    const normalized = String(value || '').trim();
    return normalized === '' ? null : normalized;
};

const buildSameAs = (site) =>
    (site?.social_links || [])
        .map((link) => link?.url)
        .filter(Boolean);

export const buildOrganizationSchema = (site, appUrl) => {
    const name =
        normalizeString(site?.seo?.organization?.name) ||
        normalizeString(site?.site_name);
    if (!name) {
        return null;
    }

    const url = normalizeString(appUrl);
    const sameAs = buildSameAs(site);
    const logo = resolveAbsoluteUrl(site?.seo?.organization?.logo, appUrl);
    const image = resolveAbsoluteUrl(site?.seo?.default_og_image, appUrl);
    const email = normalizeString(site?.contact?.email);
    const phone = normalizeString(site?.contact?.phone);
    const location = normalizeString(site?.contact?.location);
    const description =
        normalizeString(site?.seo?.meta_description) ||
        normalizeString(site?.tagline);
    const id = url ? `${url.replace(/\/$/, '')}#organization` : null;

    const schema = {
        '@type': 'Organization',
        name,
        ...(id ? { '@id': id } : {}),
        ...(url ? { url } : {}),
        ...(description ? { description } : {}),
        ...(logo ? { logo } : {}),
        ...(image ? { image } : {}),
        ...(sameAs.length ? { sameAs } : {}),
        ...(email ? { email } : {}),
        ...(phone ? { telephone: phone } : {}),
    };

    if (location) {
        schema.address = {
            '@type': 'PostalAddress',
            addressLocality: location,
        };
    }

    if (email || phone) {
        schema.contactPoint = [
            {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                ...(email ? { email } : {}),
                ...(phone ? { telephone: phone } : {}),
            },
        ];
    }

    return schema;
};

export const buildPersonSchema = (site, appUrl, organization = null) => {
    const name =
        normalizeString(site?.seo?.person?.name) ||
        normalizeString(site?.site_name);
    if (!name) {
        return null;
    }

    const url = normalizeString(appUrl);
    const sameAs = buildSameAs(site);
    const jobTitle =
        normalizeString(site?.seo?.person?.job_title) ||
        normalizeString(site?.tagline);
    const description =
        normalizeString(site?.seo?.meta_description) ||
        normalizeString(site?.tagline);
    const image = resolveAbsoluteUrl(
        site?.seo?.person?.image || site?.seo?.default_og_image,
        appUrl,
    );
    const email = normalizeString(site?.contact?.email);
    const phone = normalizeString(site?.contact?.phone);
    const id = url ? `${url.replace(/\/$/, '')}#person` : null;

    const schema = {
        '@type': 'Person',
        name,
        ...(id ? { '@id': id } : {}),
        ...(url ? { url } : {}),
        ...(jobTitle ? { jobTitle } : {}),
        ...(description ? { description } : {}),
        ...(image ? { image } : {}),
        ...(sameAs.length ? { sameAs } : {}),
        ...(email ? { email } : {}),
        ...(phone ? { telephone: phone } : {}),
    };

    if (organization) {
        schema.worksFor = {
            '@type': organization['@type'] || 'Organization',
            name: organization.name,
            ...(organization['@id'] ? { '@id': organization['@id'] } : {}),
            ...(organization.url ? { url: organization.url } : {}),
        };
    }

    return schema;
};

export const buildSeoGraph = (items = []) => {
    const graph = items.filter(Boolean);
    if (graph.length === 0) {
        return null;
    }

    return {
        '@context': 'https://schema.org',
        '@graph': graph,
    };
};
