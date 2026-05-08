import axios from 'axios'
import { api, url } from '../resources/api'

const responseArray = (response, label) => {
  if (response && Array.isArray(response.data)) {
    return response.data
  }

  console.warn(`${label}: expected array response`)
  return []
}

const totalPages = (response) => {
  const pages = Number(response && response.headers && response.headers['x-wp-totalpages'])
  return Number.isFinite(pages) ? pages : 0
}

export const siteMap = {
  path: '/sitemap.xml',
  hostname: url,
  gzip: true,
  lastmod: new Date(),
  sitemaps: [
    {
      path: '/sitemap-pages.xml',
      defaults: {
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date()
      },
      routes: [
        {
          url: '/',
          priority: 1
        },
        {
          url: '/about',
          priority: 0.9
        },
        {
          url: '/services',
          priority: 0.9
        },
        {
          url: '/contact',
          priority: 0.9
        },
        {
          url: '/faq',
          priority: 0.8
        },
        {
          url: '/blog',
          priority: 0.8
        }
      ]
    },
    {
      path: '/blog/sitemap-blog.xml',
      defaults: {
        changefreq: 'daily',
        priority: 0.1,
        lastmod: new Date()
      },
      exclude: ['/**'],
      routes: async () => {
        try {
          // Get All Blog Posts
          const response = await axios.get(`${api}/wp/v2/posts?per_page=100`)
          const dataPages = totalPages(response)
          const routes = []
          let blogArray = responseArray(response, 'SITEMAP BLOG API')
          routes.push('/blog/page/1')
          for (let i = 2; i <= dataPages; i++) {
            const nextPage = await axios.get(
              `${api}/wp/v2/posts?per_page=100&page=${i}`
            )
            blogArray = [...blogArray, ...responseArray(nextPage, 'SITEMAP BLOG API')]
            routes.push('/blog/page/' + i)
          }
          blogArray.forEach((post) => {
            routes.push('/blog/' + post.slug)
          })
          return routes
        } catch (e) {
          console.warn('SITEMAP BLOG API: ' + e)
          return []
        }
      }
    }
  ]
}

export const setRobots = {
  UserAgent: '*',
  Disallow: '/',
  Sitemap: url + 'sitemap.xml'
}
