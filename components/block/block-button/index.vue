<template lang='pug' src='./index.pug'></template>

<script>
import { setJSONData } from '~/resources/utils'

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
