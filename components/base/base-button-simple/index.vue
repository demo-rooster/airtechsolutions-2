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
      default: 'text'
    },
    noArrow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    displayLabel () {
      return ['Contact Us', 'Call Now'].includes(this.props?.label) ? 'Schedule Now' : this.props?.label
    },
    themeColor () {
      const theme = getThemeJSON()
      const colors = theme.default?.colors || []
      return colors.find(c => c.label === this.variant) || colors.find(c => c.label === 'text')
    },
    textColor () {
      return this.themeColor?.hex || '#272727'
    },
    buttonStyles () {
      return { '--simpleBtnClr': this.textColor }
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
