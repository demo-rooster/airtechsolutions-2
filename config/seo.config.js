import fs from 'fs'
import path from 'path'
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

const getLocalServiceGuides = () => {
  const guidesFile = path.join(process.cwd(), 'data', 'service-guides.json')
  if (!fs.existsSync(guidesFile)) {
    return []
  }

  try {
    return JSON.parse(fs.readFileSync(guidesFile, 'utf8'))
  } catch (e) {
    console.warn('SITEMAP SERVICE GUIDES LOCAL: ' + e)
    return []
  }
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
          url: '/commercial-window-cleaning-boston-west-newton-ma',
          priority: 0.9
        },
        {
          url: '/commercial-office-exterior-cleaning-boston-west-newton-ma',
          priority: 0.9
        },
        {
          url: '/professional-commercial-exterior-cleaning-boston-ma',
          priority: 0.9
        },
        {
          url: '/commercial-soft-washing-boston-west-newton-ma',
          priority: 0.9
        },
        {
          url: '/commercial-dryer-vent-cleaning-boston-west-newton-ma',
          priority: 0.9
        },
        {
          url: '/commercial-bathroom-exhaust-cleaning-boston-west-newton-ma',
          priority: 0.9
        },
        {
          url: '/commercial-bathroom-exhaust-repair-boston-west-newton-ma',
          priority: 0.9
        },
        {
          url: '/commercial-gutter-cleaning-boston-west-newton-ma',
          priority: 0.9
        },
        {
          url: '/commercial-hvac-cleaning-boston-west-newton-ma',
          priority: 0.9
        },
        {
          url: '/commercial-air-quality-testing-boston-west-newton-ma',
          priority: 0.9
        },
        {
          url: '/commercial-caulking-services-boston-west-newton-ma',
          priority: 0.9
        },
        {
          url: '/commercial-sealing-services-boston-west-newton-ma',
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
        },
        {
          url: '/service-guides',
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
    },
    {
      path: '/service-guides/sitemap-service-guides.xml',
      defaults: {
        changefreq: 'daily',
        priority: 0.1,
        lastmod: new Date()
      },
      exclude: ['/**'],
      routes: () => {
        const guides = getLocalServiceGuides()
        const routes = []
        const postsPerPage = 5
        const pageCount = Math.ceil(guides.length / postsPerPage)

        for (let i = 1; i <= pageCount; i++) {
          routes.push('/service-guides/page/' + i)
        }
        guides.forEach((guide) => {
          routes.push('/service-guides/' + guide.slug)
        })

        return routes
      }
    }
  ]
}

export const setRobots = {
  UserAgent: '*',
  Disallow: '/',
  Sitemap: url + 'sitemap.xml'
}
