import axios from 'axios'
import { api, url } from './api'

const emptyPageData = (slug = '') => ({
  title: slug,
  slug,
  sections: [],
  meta: {}
})

const emptyPostsData = () => ({
  posts: [],
  postsPerPage: { '1': [] },
  pageCount: 0
})

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

const getLocalPosts = (customPostType = 'posts') => {
  try {
    if (customPostType === 'service-guides') {
      return require('../data/service-guides.json')
    }

    return require('../data/posts.json')
  } catch (e) {
    return []
  }
}

const getPostBasePath = customPostType => customPostType === 'posts' ? 'blog' : customPostType

const mapPost = (item, customPostType = 'posts') => ({
  id: item.id,
  title: item.title,
  path: `/${getPostBasePath(customPostType)}/${item.slug}`,
  slug: item.slug,
  category: item.categories ? item.categories[0] : null,
  date: item.date,
  post: item.acf
})

const buildPostsData = (posts, total = 100, customPostType = 'posts') => {
  const perPage = Math.max(Number(total) || 100, 1)
  const sortedDataArr = posts.map(post => mapPost(post, customPostType)).sort((a, b) => {
    const aDate = new Date(a.date)
    const bDate = new Date(b.date)
    return bDate - aDate
  })
  const currentPosts = {}
  sortedDataArr.forEach((post, index) => {
    const page = `${Math.floor(index / perPage) + 1}`
    if (!currentPosts[page]) {
      currentPosts[page] = []
    }
    currentPosts[page].push(post)
  })

  return {
    posts: sortedDataArr,
    postsPerPage: currentPosts,
    pageCount: Math.ceil(sortedDataArr.length / perPage)
  }
}

export const getAllPages = async () => {
  try {
    const getPath = (str) => {
      const regex = /.*\.com/ // eslint-disable-line
      const match = str.match(regex)
      if (match) {
        return str.replace(match[0], '')
      } else {
        return str
      }
    }

    const response = await axios.get(
      `${api}/wp/v2/pages?per_page=100`
    )

    const dataPages = totalPages(response)
    let dataArray = responseArray(response, 'ERROR getting pages for dev-mode-component-locations')
    for (let i = 2; i <= dataPages; i++) {
      const nextPage = await axios.get(
        `${api}/wp/v2/pages?per_page=100&page=${i}`
      )
      dataArray = [...dataArray, ...responseArray(nextPage, 'ERROR getting pages for dev-mode-component-locations')]
    }

    return dataArray.map(item => ({
      parent: item.parent,
      path: getPath(item.link),
      slug: item.slug,
      title: item.title.rendered,
      ...item.acf
    }))
  } catch (e) {
    console.warn(`ERROR getting pages for dev-mode-component-locations: ${e}`)
    return []
  }
}

// gets data for all forms
export const getForms = () => {
  try {
    return require('../data/forms.json')
  } catch (e) {
    console.warn(`ERROR loading local forms data: ${e}`)
    return []
  }
}

// gets data for all custom posts of a specific type
export const getCustomPosts = async (customPostType, total = 100) => {
  if (customPostType === 'posts' || customPostType === 'service-guides') {
    const localPosts = getLocalPosts(customPostType)
    if (localPosts.length) {
      return buildPostsData(localPosts, total, customPostType)
    }
  }

  try {
    const response = await axios.get(
      `${api}/wp/v2/${customPostType}?per_page=${total}`
    )
    const dataPages = totalPages(response)
    let dataArray = responseArray(response, `ERROR getting ${customPostType} posts`).map(item => ({
      id: item.id,
      title: item.title,
      path: `/${customPostType === 'posts' ? 'blog' : customPostType}/${item.slug}`,
      slug: item.slug,
      category: item.categories ? item.categories[0] : null,
      date: item.date,
      post: item.acf
    }))
    const currentPosts = { '1': dataArray }
    for (let i = 2; i <= dataPages; i++) {
      const nextPage = await axios.get(
        `${api}/wp/v2/${customPostType}?per_page=${total}&page=${i}`
      )
      const next = responseArray(nextPage, `ERROR getting ${customPostType} posts`).map(item => ({
        id: item.id,
        title: item.title.rendered,
        path: `/${customPostType === 'posts' ? 'blog' : customPostType}/${item.slug}`,
        slug: item.slug,
        category: item.categories ? item.categories[0] : null,
        date: item.date,
        post: item.acf
      }))
      dataArray = [...dataArray, ...next]
      currentPosts[`${i}`] = next
    }
    const sortedDataArr = dataArray.sort((a, b) => {
      const aDate = new Date(a.date)
      const bDate = new Date(b.date)
      return bDate - aDate
    })

    const data = {
      posts: sortedDataArr,
      postsPerPage: currentPosts,
      pageCount: dataPages
    }
    return data
  } catch (e) {
    console.warn(`ERROR getting ${customPostType} posts: ${e}`)
    return emptyPostsData()
  }
}

export const getThemeJSON = () => {
  return require('../data/theme.json')
}

export const setJSONData = (slug, customPostType = 'pages') => {
  try {
    const normalizedSlug = slug.toLowerCase()
    // Using require ensures data is included at build time for static generation
    const jsonData = require(`../data/${customPostType}.json`)
    if (slug === 'global') {
      return jsonData
    }

    // Get the pages data - pages.json has { pages: {...}, sitemap_metadata: {...} }
    const pagesData = jsonData.pages || jsonData

    // Get the data array for this slug - make it case insensitive
    const pageKey = Object.keys(pagesData).find(key => key.toLowerCase() === normalizedSlug)
    const slugData = pagesData[slug] || pagesData[normalizedSlug] || pagesData[pageKey]
    let seoData = {}
    let pageSections = []

    if (!slugData) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`No item found with slug: ${slug} in ${customPostType}.json`)
      }
      return emptyPageData(slug)
    }

    // If slugData is an array, process it
    if (Array.isArray(slugData)) {
      // Extract SEO object from the array if it exists
      pageSections = slugData.filter(item => item && !item.seo)
      const seoItem = slugData.find(item => item && item.seo)
      if (seoItem) {
        seoData = seoItem
      }
    } else {
      // If not an array, use as is
      pageSections = Array.isArray(slugData.sections) ? slugData.sections : []
      seoData = slugData.meta || {}
    }

    const item = {
      title: slug,
      slug: normalizedSlug === 'home' ? '' : normalizedSlug.replace(/^\/+/, ''),
      sections: pageSections,
      meta: seoData
    }

    return item
  } catch (error) {
    console.warn(`Error loading data for ${slug}:`, error.message)
    return emptyPageData(slug)
  }
}

export const setData = async (slug, customPostType = 'pages') => {
  if (customPostType === 'posts' || customPostType === 'service-guides') {
    const localPost = getLocalPosts(customPostType).find(post => post.slug === slug)
    if (localPost) {
      return {
        title: localPost.title.rendered,
        slug: localPost.slug,
        ...localPost.acf
      }
    }
  }

  if (customPostType === 'pages') {
    const localPage = setJSONData(slug)
    if (localPage.sections.length || Object.keys(localPage.meta || {}).length) {
      return localPage
    }
  }

  try {
    const response = await axios.get(
      `${api}/wp/v2/${customPostType}?slug=${slug}`
    )

    const dataArray = responseArray(response, `${slug} page`)
    if (!dataArray.length) {
      return emptyPageData(slug)
    }

    const data = {
      title: dataArray[0].title.rendered,
      slug: dataArray[0].slug,
      ...dataArray[0].acf
    }
    return { ...data }
  } catch (e) {
    console.warn(`${slug} page: ${e}`)
    return emptyPageData(slug)
  }
}

export const setMeta = (meta) => {
  const pageMeta = meta || emptyPageData()
  // Get the SEO data from either meta.seo or meta.meta.seo
  const seoData = pageMeta.seo || (pageMeta.meta && pageMeta.meta.seo) || {}

  return {
    title: seoData.page_title ? seoData.page_title : pageMeta.title,
    meta: [
      seoData.page_description && { hid: 'description', name: 'description', content: seoData.page_description },
      seoData.page_keywords && { hid: 'keywords', name: 'keywords', content: seoData.page_keywords },
      // // OG Meta
      { hid: 'og:type', property: 'og:type', content: 'website' },
      seoData.page_title && { hid: 'og:title', property: 'og:title', content: seoData.social_meta?.og_meta?.title ? seoData.social_meta.og_meta.title : seoData.page_title },
      seoData.page_description && { hid: 'og:description', property: 'og:description', content: seoData.social_meta?.og_meta?.description ? seoData.social_meta.og_meta.description : seoData.page_description },
      seoData.social_meta?.og_meta?.image && { hid: 'og:image', property: 'og:image', content: seoData.social_meta.og_meta.image },
      { hid: 'og:url', property: 'og:url', content: `${url}${pageMeta.slug || ''}` }
    ].filter(Boolean),
    link: [
      { hid: 'canonical', rel: 'canonical', href: `${url}${pageMeta.slug || ''}` }
    ]
  }
}
