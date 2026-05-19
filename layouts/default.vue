<template src='./default.pug' lang='pug'></template>

<script>
import { getCustomPosts, getForms, setJSONData, getThemeJSON } from '~/resources/utils'
import DevModeBanner from '~/components/dev-mode/dev-mode-banner'
import Popup from '~/components/popup'
import SkipLink from '~/components/base/base-skip-link'
import TheFooter from '~/components/footer'
import TheNavigation from '~/components/navigation'
import BaseAccess from '~/components/base/base-access'

export default {
  components: {
    BaseAccess,
    DevModeBanner,
    Popup,
    SkipLink,
    TheFooter,
    TheNavigation
  },
  data: () => ({
    forms: null,
    posts: null,
    global: null,
    theme: null,
    popupActive: false,
    showDevModeBanner: false
  }),
  watch: {
    $route: 'onRouteChange'
  },
  async fetch () {
    this.forms = await getForms()
    this.posts = await getCustomPosts('posts', 5)
    this.global = await setJSONData('global', 'globalData')
    const theme = await getThemeJSON()
    this.theme = theme.default
    // console.log('theme', this.theme)

    this.$store.dispatch('SET_BLOG', this.posts)
    this.$store.dispatch('SET_GLOBAL', this.global)
    this.$store.dispatch('SET_FORMS', this.forms)
  },
  mounted () {
    this.updateGlobalStyles()
    this.checkWindowWidth()

    if (this.$route.path === '/' && this.global.enable_popup) {
      this.popupActive = true
    }

    this.showDevModeBanner = process.env.NODE_ENV === 'development' && this.global.enable_development_mode

    window.addEventListener('resize', () => {
      this.checkWindowWidth()
    })
  },
  methods: {
    checkWindowWidth () {
      this.$nextTick(() => {
        this.$store.dispatch('IS_PHONE_LAND_LG', window.innerWidth <= 900 && window.innerHeight <= 480)
        this.$store.dispatch('IS_PHONE_LG', window.innerWidth <= 480)
        this.$store.dispatch('IS_TABLET', window.innerWidth <= 768)
        this.$store.dispatch('IS_TABLET_MD', window.innerWidth <= 880)
        this.$store.dispatch('IS_TABLET_LG', window.innerWidth <= 1024)
      })
    },
    onRouteChange () {
      const target = document.querySelector('#page-wrapper')
      target.focus()
    },
    updateGlobalStyles () {
      const root = document.documentElement

      // Colors
      if (this.theme && this.theme.colors) {
        this.theme.colors.forEach((color) => {
          root.style.setProperty(`--${color.label}`, `rgba(${color.color.red}, ${color.color.green}, ${color.color.blue}, ${color.color.alpha})`)
          root.style.setProperty(`--${color.label}-rgb`, `${color.color.red}, ${color.color.green}, ${color.color.blue}`)
        })
      }

      // Typography
      if (this.theme && this.theme.typography) {
        this.theme.typography.forEach((font) => {
          root.style.setProperty(`--${font.label}`, font.font)
        })
      }
    }
  }
}
</script>
<style>
  main:focus {
    outline: none;
  }
  #page-wrapper:focus {
    outline: none;
  }
  #page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  #main-content {
    flex: 1;
  }
</style>
