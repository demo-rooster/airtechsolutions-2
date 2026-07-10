<template lang="pug" src="./index.pug" ></template>

<script>
import { getThemeJSON } from '~/resources/utils'

export default {
  props: {
    props: {
      type: Object,
      default: () => ({})
    },
    variant: {
      type: String,
      default: 'secondary'
    }
  },
  computed: {
    displayLabel () {
      return ['Contact Us', 'Call Now'].includes(this.props?.label) ? 'Schedule Now' : this.props?.label
    },
    themeColor () {
      const theme = getThemeJSON()
      const colors = theme.default?.colors || []
      return colors.find(c => c.label === this.variant) || colors.find(c => c.label === 'secondary')
    },
    buttonStyles () {
      if (!this.themeColor) { return {} }
      return {
        '--btn-bg': this.themeColor.hex,
        '--btn-text': this.themeColor.accessibility?.recommendedTextColor || '#ffffff'
      }
    }
  },
  methods: {
    onClick () {
      this.$emit('onClick')
    }
  }
}
</script>

<style lang="sass" src="./index.sass"></style>
