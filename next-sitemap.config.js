const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
// Localized sitemap: emit <xhtml:link rel="alternate" hreflang> per enabled locale
// so search engines index every language version (Next i18n serves the default
// locale at root, others under /<loc>).
const LOCALES =
  process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true' &&
  process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES
    ? process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES.split(',')
    : [process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en'];
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en';

module.exports = {
  siteUrl: SITE,
  generateRobotsTxt: true, // (optional)
  alternateRefs:
    LOCALES.length > 1
      ? LOCALES.map((loc) => ({
          href: loc === DEFAULT_LOCALE ? SITE : `${SITE}/${loc}`,
          hreflang: loc,
        }))
      : undefined,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        // allow: '/',
        disallow: ['*/logout', '*/checkout*', '*/404', '*/profile'],
      },
    ],
  },
  exclude: [
    '*/404',
    '*/change-password',
    '*/downloads',
    '*/logout',
    '*/refunds',
    '*/profile',
    '*/checkout*',
    '*/orders*',
  ],
};
