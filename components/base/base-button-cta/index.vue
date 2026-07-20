<template lang="pug" src="./index.pug" ></template>

<script>
export default {
  props: {
    props: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    displayLabel () {
      return ['Contact Us', 'Call Now'].includes(this.props?.label) ? 'Schedule Now' : this.props?.label
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
