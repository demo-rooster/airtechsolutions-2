import { url } from '../resources/api'

export const siteHead = (meta, theme = {}) => {
  const faviconUrl = theme?.default?.favicon_url || '/favicon.ico'
  const seo = meta.seo || (meta.meta && meta.meta.seo) || {}
  const socialMeta = seo.social_meta || {}
  const ogMeta = socialMeta.og_meta || {}
  return {
    htmlAttrs: { lang: 'en' },
    title: seo.page_title ? seo.page_title : meta.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'referrer', content: 'no-referrer' },
      { hid: 'robots', name: 'robots', content: 'noindex, nofollow' },
      { hid: 'description', name: 'description', content: seo.page_description || '' },
      { hid: 'keywords', name: 'keywords', content: seo.page_keywords ? seo.page_keywords : '' },
      // OG Meta
      { hid: 'og:type', property: 'og:type', content: 'website' },
      ogMeta.title && { hid: 'og:title', property: 'og:title', content: ogMeta.title },
      ogMeta.description && { hid: 'og:description', property: 'og:description', content: ogMeta.description },
      ogMeta.image && { hid: 'og:image', property: 'og:image', content: ogMeta.image },
      { hid: 'og:url', property: 'og:url', content: url }
    ].filter(Boolean),
    link: [
      { rel: 'icon', href: faviconUrl },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
      { hid: 'canonical', rel: 'canonical', href: url }
    ],
    script: [
      {
        hid: 'gtag',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-EP9BQ2J5P8',
        async: true
      },
      {
        hid: 'gtag-config',
        type: 'text/javascript',
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-EP9BQ2J5P8');
        `
      }
    ],
    __dangerouslyDisableSanitizersByTagID: {
      'gtag-config': ['innerHTML']
    }
  }
}
