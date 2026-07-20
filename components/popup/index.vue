<template lang="pug" src="./index.pug"></template>

<script>
import { bodyScroll } from '~/resources/mixins'

export default {
  mixins: [bodyScroll],
  props: {
    props: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    popupActive: false
  }),
  mounted () {
    this.$_stopBodyScroll()
    this.popupActive = true
  },
  beforeDestroy () {
    if (this.popupActive) {
      this.$_resetBodyScroll()
    }
  },
  methods: {
    handleClose (value) {
      this.popupActive = value
      this.$emit('closemodal', value)
    }
  }
}
</script>

<style lang="sass" src="./index.sass"></style>
