<template lang="pug" src="./_page.pug"></template>

<script>
import { setJSONData, setMeta } from '~/resources/utils'
import { buildSectionStyleVars } from '~/resources/theme-scheme'
import BlockRepeaterPost from '~/components/block/block-repeater-post'
import TheHero from '~/components/hero/hero-main'

export default {
  transition: 'fade',
  components: {
    BlockRepeaterPost,
    TheHero
  },
  computed: {
    // This page renders the hero directly instead of through PageSections, so
    // it has to supply the same dark-background title color the hero relies on.
    heroStyle () {
      const theme = this.$store.state.theme

      return theme ? buildSectionStyleVars(theme, `${this.$route.path}::hero-0`, null, 'titles-dark') : {}
    }
  },
  asyncData () {
    const props = setJSONData('service-guides')
    return { props }
  },
  mounted () {
    this.$nextTick(() => {
      if (!this.$store.state.siteLoaded) {
        this.$store.dispatch('VIEW_SITE', true)
      }
    })
  },
  head () {
    return setMeta(this.props)
  }
}
</script>
