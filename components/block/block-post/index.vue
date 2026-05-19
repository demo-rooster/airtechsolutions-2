<template lang="pug" src="./index.pug"></template>

<script>
import { debounce } from '~/resources/mixins'
import BaseImage from '~/components/base/base-image'
import BaseIcon from '~/components/base/base-icon/base-icon'

export default {
  components: {
    BaseImage,
    BaseIcon
  },
  mixins: [debounce],
  props: {
    blogs: {
      type: Array,
      default: () => ([])
    },
    props: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    nextPost: null,
    prevPost: null,
    postUrl: '',
    navHeight: '0px'
  }),
  computed: {
    blogLinks () {
      const linkArr = this.blogs.map((post) => {
        return post.link
      })
      return linkArr
    }
  },
  mounted () {
    this.getNavHeight()
    window.addEventListener('resize', this.debounceFunc)

    const currIndex = this.blogLinks.indexOf(this.$route.path)
    this.nextPost = currIndex === this.blogLinks.length - 1 ? null : this.blogLinks[currIndex + 1]
    this.prevPost = currIndex === 0 ? null : this.blogLinks[currIndex - 1]
    this.postUrl = document.location.href

    this.$store.dispatch('VIEW_SITE', true)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.debounceFunc)
  },
  methods: {
    debounceFunc () {
      this.debounce(this.handleResize, null, 300)
    },
    handleResize () {
      this.getNavHeight()
    },
    getNavHeight () {
      this.$nextTick(() => {
        const navHeight = document.querySelector('.navigation').clientHeight
        this.navHeight = `${navHeight}px`
      })
    }
  }
}
</script>

<style lang="sass" src="./index.sass"></style>
