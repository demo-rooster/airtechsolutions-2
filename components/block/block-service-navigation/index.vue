<template lang="pug" src="./index.pug"></template>

<script>
export default {
  props: {
    props: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    services () {
      if (!this.props.items || !this.props.items.length) {
        return []
      }

      return this.props.items.map(item => ({
        ...item,
        iconSrc: require(`~/assets/service-icons/${item.icon}`)
      }))
    }
  },
  methods: {
    scrollToService (hash) {
      const target = document.getElementById(hash)

      if (!target) {
        return
      }

      const navigation = document.querySelector('.navigation')
      const navigationHeight = navigation ? navigation.getBoundingClientRect().height : 0
      const top = target.getBoundingClientRect().top + window.pageYOffset - navigationHeight
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      window.history.replaceState(null, '', `#${hash}`)
      if (prefersReducedMotion) {
        window.scrollTo(0, top)
        return
      }

      const scrollPosition = { y: window.pageYOffset }
      const duration = Math.min(Math.max(Math.abs(top - scrollPosition.y) / 4000, 0.6), 1.5)

      this.$gsap.to(scrollPosition, {
        y: top,
        duration,
        ease: 'power2.inOut',
        overwrite: true,
        onUpdate: () => window.scrollTo(0, scrollPosition.y)
      })
    }
  }
}
</script>

<style lang="sass" src="./index.sass"></style>
