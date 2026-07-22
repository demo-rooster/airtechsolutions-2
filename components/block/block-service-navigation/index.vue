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
  }
}
</script>

<style lang="sass" src="./index.sass"></style>
