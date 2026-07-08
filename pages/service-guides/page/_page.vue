<template lang="pug" src="./_page.pug"></template>

<script>
import { setJSONData, setMeta } from '~/resources/utils'
import BlockRepeaterPost from '~/components/block/block-repeater-post'
import TheHero from '~/components/hero/hero-main'

export default {
  transition: 'fade',
  components: {
    BlockRepeaterPost,
    TheHero
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
