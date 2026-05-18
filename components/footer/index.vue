<template lang="pug" src="./index.pug"></template>

<script>
import router from '~/router/index'
import { removeFocus } from '~/resources/mixins'

export default {
  mixins: [removeFocus],
  computed: {
    links () {
      return router.filter(link => link.navigation || link.mobile || link.footer)
    }
  }
}
</script>

<style lang="sass" src="./index.sass"></style>
