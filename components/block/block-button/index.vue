<template lang='pug' src='./index.pug'></template>

<script>
import { setJSONData } from '~/resources/utils'
import { buildSectionStyleVars } from '~/resources/theme-scheme'

export default {
  props: {
    props: {
      type: Object,
      default: () => ({})
    },
    customizationSectionKey: {
      type: String,
      default: ''
    },
    customizationKey: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    global: null
  }),
  computed: {
    displayLabel () {
      return ['Contact Us', 'Call Now'].includes(this.props?.label) ? 'Schedule Now' : this.props?.label
    },
    colorStyle () {
      const colors = this.props.colors || {}
      const buttonStyle = {
        '--button-background': colors.background || null,
        '--button-text': colors.text || null,
        '--button-hover-background': colors.hover_background || null,
        '--button-hover-text': colors.hover_text || null
      }

      if (!this.customizationSectionKey || !this.customizationKey) {
        return buttonStyle
      }

      const overrideKey = `${this.$route.path}::${this.customizationSectionKey}::${this.customizationKey}`

      return {
        ...buttonStyle,
        ...buildSectionStyleVars(this.$store.state.theme, overrideKey)
      }
    }
  },
  async fetch () {
    this.global = await setJSONData('global', 'globalData')
  },
  methods: {
    handleClick () {
      // Add custom functionality ================

      // this.$emit('emit-function-name', true)
      console.log('button clicked')
    },
    handleAnimation () {
      // this.$_fadeIn(this.$refs.button, 0, 32, 'top', 0, 1.25)
    }
  }
}
</script>

<style lang='sass' src='./index.sass'></style>
