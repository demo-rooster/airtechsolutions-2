<template lang='pug' src='./index.pug'></template>

<script>
import { setJSONData, getThemeJSON } from '~/resources/utils'

export default {
  props: {
    props: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    global: null
  }),
  computed: {
    displayLabel () {
      return ['Contact Us', 'Call Now'].includes(this.props?.label) ? 'Schedule Now' : this.props?.label
    },
    themeColors () {
      const theme = getThemeJSON()
      return theme.default?.colors || []
    },
    buttonStyles () {
      const style = this.props?.style || 'primary'
      let bgColorLabel = 'secondary'

      if (style === 'secondary') {
        bgColorLabel = 'primary'
      } else if (style === 'primary') {
        bgColorLabel = 'secondary'
      }

      const bgColor = this.themeColors.find(c => c.label === bgColorLabel)
      if (!bgColor) { return {} }

      return {
        '--block-btn-bg': bgColor.hex,
        '--block-btn-text': bgColor.accessibility?.recommendedTextColor || '#ffffff'
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
