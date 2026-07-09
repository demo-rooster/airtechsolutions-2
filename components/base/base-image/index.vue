<template lang='pug' src='./index.pug'></template>

<script>

export default {
  props: {
    src: {
      type: String,
      default: () => ``
    },
    webp: {
      type: String,
      default: () => ``
    },
    jp2: {
      type: String,
      default: () => ``
    },
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    imageBackground: {
      type: Boolean,
      default: false
    },
    addLoader: {
      type: Boolean,
      default: false
    },
    objectPosition: {
      type: String,
      default: 'center center'
    },
    alt: {
      type: String,
      default: () => {
        if (process.client) {
          return `${document.location.hostname} image for section`
        }
      }
    },
    forceAlt: {
      type: Boolean,
      default: false
    },
    forceVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentImg: null,
      currWebP: null,
      currJp2: null,
      imageType: 'contain',
      loading: true,
      loaded: false,
      intersectionOptions: {
        root: null,
        rootMargin: '500px 0px 0px 0px',
        threshold: [ 0.01 ]
      }
    }
  },
  created () {
    if (process.client) {
      if (this.imageBackground) {
        this.imageType = 'cover'
      }
    }
  },
  mounted () {
    this.loaded = true
    if (this.forceVisible) {
      this.setImageSources()
    }
  },
  methods: {
    setImageSources () {
      this.currentImg = this.src
      this.currWebP = this.webp
      this.currJp2 = this.jp2
    },
    onImageLoad () {
      this.loading = false
    },
    onWaypoint ({ going }) {
      if (going === 'in' || this.forceVisible) {
        this.setImageSources()
      }
    }
  }
}
</script>

<style lang="sass" src="./index.sass"></style>
