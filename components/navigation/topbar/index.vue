<template lang='pug' src='./index.pug'></template>

<script>
import Popup from '~/components/popup'
import { removeFocus } from '~/resources/mixins'

export default {
  components: {
    Popup
  },
  mixins: [
    removeFocus
  ],
  props: {
    props: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    modalOpen: false,
    windowWidth: null
  }),
  computed: {
    popupContent () {
      return this.$store.state.theme?.popup || this.props.announcement?.modal || null
    },
    canOpenPopup () {
      return this.props.type === 'announcement' && !!this.props.announcement?.open_popup && !!this.popupContent
    },
    barClasses () {
      return [
        `topbar__bar--${this.props.theme}`,
        `topbar__bar--${this.props.type}`,
        { 'topbar__bar--clickable': this.canOpenPopup }
      ]
    }
  },
  mounted () {
    this.setWindowWidth()
    window.addEventListener('resize', this.setWindowWidth)
  },
  destroyed () {
    window.removeEventListener('resize', this.setWindowWidth)
  },
  methods: {
    setWindowWidth () {
      this.windowWidth = window.innerWidth
    },
    openModal () {
      this.modalOpen = true
      this.$_removeFocus()
    }
  }
}
</script>

<style lang='sass' src='./index.sass'></style>
