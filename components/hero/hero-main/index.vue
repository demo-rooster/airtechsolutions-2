<template lang="pug" src="./index.pug"></template>

<script>
import BlockButton from '~/components/block/block-button'

export default {
  components: {
    BlockButton
  },
  props: {
    props: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    imgSrc: null,
    webpSrc: null,
    videoPlaying: true,
    options: {
      root: null,
      rootMargin: '0px',
      threshold: [ 0.01 ]
    }
  }),
  computed: {
    hasHeroLogo () {
      return Boolean(this.props.logo && this.props.logo.name)
    }
  },
  mounted () {
    if (this.$refs.image) {
      this.loadImage()
    }
    if (this.$refs.video) {
      this.$refs.video.addEventListener('loadeddata', () => {
        if (!this.$store.state.siteLoaded) {
          this.$store.dispatch('VIEW_SITE', true)
        }
        this.handleAnimation()
      })
    }
    if (!this.$refs.video && !this.props.image.src) {
      if (!this.$store.state.siteLoaded) {
        this.$store.dispatch('VIEW_SITE', true)
      }
      this.handleAnimation()
    }
  },
  methods: {
    loadImage () {
      this.imgSrc = this.props.image.src
      this.webpSrc = this.props.image.webp
      this.$refs.image.children[1].onload = () => {
        if (!this.$store.state.siteLoaded) {
          this.$store.dispatch('VIEW_SITE', true)
        }
        this.handleAnimation()
      }
    },
    playVideo () {
      this.$refs.video.play()
      this.videoPlaying = true
    },
    pauseVideo () {
      this.$refs.video.pause()
      this.videoPlaying = false
    },
    handleCtaClick () {
      // Navigate to contact page with form hash
      if (this.props.button.path && this.props.button.hash) {
        this.$router.push(this.props.button.path + this.props.button.hash)
      } else if (this.props.button.path) {
        this.$router.push(this.props.button.path)
      }
    },
    handleAnimation (delay) {
      this.$CustomEase.create('customEaseOut', '0.23, 1, 0.32, 1')
      const tl = this.$gsap.timeline()
      const heroTitle = this.$refs.heroTitle
      const heroText = this.$refs.heroText
      const heroBtn = this.$refs.heroBtn

      /* eslint-disable */
      if (this.hasHeroLogo) {
        tl.from(heroTitle, {
          y: '32',
          opacity: 0,
          duration: 1.25,
          delay: 0.25,
          ease: 'customEaseOut'
        })
      } else {
        const titleSplit = new this.$SplitText(heroTitle, { type: 'lines' })

        tl.from(titleSplit.lines, {
          y: '32',
          opacity: 0,
          duration: 1.25,
          stagger: 0.115,
          delay: 0.25,
          ease: 'customEaseOut'
        })
      }
      if (heroText) {
        tl.from(heroText, {
          y: '24',
          opacity: 0,
          duration: 1,
          ease: 'customEaseOut'
        }, '<+=0.175')
      }
      if (heroBtn) {
        tl.from('.hero-main__cta', {
          y: '24',
          opacity: 0,
          duration: 1,
          ease: 'customEaseOut'
        }, '<+=0.175')
      }
      if (this.$route.path === '/') {
        tl.from('.hero-main__down', {
          opacity: 0,
          duration: 0.6,
          ease: 'ease'
        })
      }
    }
  }
}
</script>

<style lang="sass" src="./index.sass"></style>
