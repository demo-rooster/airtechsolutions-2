<template lang='pug' src='./index.pug'></template>

<script>
import { formatSlotRef, slotCssValue, transparentSlotRef } from '~/resources/theme-scheme'

export default {
  props: {
    scheme: {
      type: Array,
      required: true
    },
    selectedRef: {
      type: String,
      default: null
    },
    showTransparent: {
      type: Boolean,
      default: false
    },
    compact: {
      type: Boolean,
      default: false
    },
    disableLocked: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    variants: ['light', 'dark']
  }),
  computed: {
    transparentSelected () {
      return this.selectedRef === transparentSlotRef
    }
  },
  methods: {
    slotRef (family, variant) {
      return formatSlotRef(family.key, variant)
    },
    isSelected (family, variant) {
      return this.selectedRef === this.slotRef(family, variant)
    },
    isDisabled (family) {
      return this.disableLocked && !!family.locked
    },
    swatchStyle (family, variant) {
      return { background: slotCssValue(family[variant]) }
    },
    swatchLabel (family, variant) {
      const name = family.name || family.key
      const variantLabel = variant === 'light' ? 'Light' : 'Dark'

      return `${name} (${variantLabel})${family.locked ? ' — locked' : ''}`
    },
    swatchClasses (family, variant) {
      return {
        'customization-scheme-picker__swatch--selected': this.isSelected(family, variant),
        'customization-scheme-picker__swatch--locked': !!family.locked,
        'customization-scheme-picker__swatch--disabled': this.isDisabled(family)
      }
    },
    variantLabel (variant) {
      return variant === 'light' ? 'Light' : 'Dark'
    },
    selectSwatch (family, variant) {
      if (this.isDisabled(family)) {
        return
      }

      this.$emit('select', {
        ref: this.slotRef(family, variant),
        family,
        variant
      })
    },
    selectTransparent () {
      this.$emit('select', {
        ref: transparentSlotRef,
        family: null,
        variant: null
      })
    }
  }
}
</script>

<style lang='sass' src='./index.sass'></style>
