<template lang="pug" src="./index.pug" ></template>

<script>
import { fadeUpIn } from '~/resources/mixins'
import BlockButton from '~/components/block/block-button'
import BaseIcon from '~/components/base/base-icon/base-icon.vue'

export default {
  components: {
    BlockButton,
    BaseIcon
  },
  mixins: [fadeUpIn],
  props: {
    props: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    itemWidth: null,
    maxHeight: null
  }),
  computed: {
    isServiceIcons () {
      return this.props.variant === 'service_icons'
    },
    itemRows () {
      if (!this.props.items || !this.props.items.length) {
        return []
      }

      if (!this.isServiceIcons) {
        return this.props.items
      }

      return this.props.items.map(item => ({
        ...item,
        serviceIconSrc: item.service_icon ? require(`~/assets/service-icons/${item.service_icon}`) : null
      }))
    }
  },
  mounted () {
    this.getMaxHeight()
    window.addEventListener('resize', this.getMaxHeight)
    if (this.props.title) {
      this.$_fadeUpIn(this.$refs.theTitle, 40)
    }
    this.$refs.item.forEach((item, i) => {
      this.$_fadeUpIn(item, 48)
    })
    if (this.props.add_cta) {
      this.$_fadeUpIn(this.$refs.mainBtn, 24)
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getMaxHeight)
  },
  methods: {
    handleItemClick (item) {
      // Enter logic here for what the item button should do
      console.log(item)
    },
    handleCtaClick () {
      // Enter logic here for the CTA button
      console.log('click CTA')
    },
    getMaxHeight () {
      if (!this.$refs.itemTitle || !this.$refs.itemTitle.length) {
        return
      }

      const newArr = []
      this.$refs.itemTitle.map(el => newArr.push(el.clientHeight))
      this.maxHeight = (Math.max(...newArr) / 16) + 'rem'
    }
  }
}
</script>

<style lang="sass" src="./index.sass"></style>
