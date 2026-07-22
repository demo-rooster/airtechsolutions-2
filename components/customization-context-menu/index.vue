<template lang='pug' src='./index.pug'></template>

<script>
import { elementRoles } from '~/resources/theme-scheme'

const buttonSelector = 'button, .base-button, .base-button-simple, .base-button-caret, .block-button'
const buttonRoles = elementRoles.filter(role => role.category === 'buttons')
const buttonRoleKeys = {
  default: ['btn-background', 'btn-text'],
  hover: ['btn-hover-background', 'btn-hover-text']
}
const headingSelector = 'h1, h2, h3, h4, h5, h6'
const textSelector = 'p, li, blockquote, span, a'
const sectionContainerSelector = '.page-sections__section-container'
const contextMenuCheckpointEvent = 'rg-theme-checkpoint'
const viewportMargin = 8
const roleLabels = {
  titles: 'Titles',
  text: 'Body text',
  'btn-background': 'Buttons',
  background: 'Section background'
}

export default {
  data: () => ({
    visible: false,
    x: 0,
    y: 0,
    role: null,
    buttonContext: false,
    buttonMode: 'default',
    sectionKey: null,
    sectionLabel: ''
  }),
  computed: {
    theme () {
      return this.$store.state.theme
    },
    themeScheme () {
      return this.theme?.scheme || []
    },
    roleLabel () {
      if (this.buttonContext) {
        return 'Button colors'
      }

      return roleLabels[this.role] || this.role
    },
    contextRoles () {
      if (this.buttonContext) {
        return buttonRoleKeys[this.buttonMode].map((key) => {
          const role = buttonRoles.find(buttonRole => buttonRole.key === key)

          return {
            ...role,
            name: key.endsWith('background') ? 'Background' : 'Text'
          }
        })
      }

      return this.role ? [{ key: this.role, name: this.roleLabel }] : []
    },
    menuStyle () {
      return {
        top: `${this.y}px`,
        left: `${this.x}px`
      }
    }
  },
  watch: {
    $route () {
      this.closeMenu()
    }
  },
  mounted () {
    document.addEventListener('contextmenu', this.handleContextMenu)
    document.addEventListener('mousedown', this.handleOutsideMousedown)
    document.addEventListener('keydown', this.handleKeydown)
    window.addEventListener('scroll', this.closeMenu, { capture: true, passive: true })
    window.addEventListener('resize', this.closeMenu)
  },
  beforeDestroy () {
    document.removeEventListener('contextmenu', this.handleContextMenu)
    document.removeEventListener('mousedown', this.handleOutsideMousedown)
    document.removeEventListener('keydown', this.handleKeydown)
    window.removeEventListener('scroll', this.closeMenu, { capture: true })
    window.removeEventListener('resize', this.closeMenu)
  },
  methods: {
    handleContextMenu (event) {
      if (!this.$store.state.customizationEnabled || !this.themeScheme.length) {
        return
      }

      const target = event.target instanceof Element ? event.target : null
      const container = target && target.closest(sectionContainerSelector)

      if (!container) {
        return
      }

      event.preventDefault()

      this.buttonContext = !!target.closest(buttonSelector)
      this.buttonMode = 'default'
      this.role = this.detectRole(target)
      this.sectionKey = this.getSectionKey(container, target)
      this.sectionLabel = this.getSectionLabel(container, target)
      this.x = event.clientX
      this.y = event.clientY
      this.visible = true

      this.$nextTick(this.clampToViewport)
    },
    detectRole (target) {
      if (target.closest(buttonSelector)) {
        return 'btn-background'
      }

      if (target.closest(headingSelector)) {
        return 'titles'
      }

      if (target.closest(textSelector)) {
        return 'text'
      }

      return 'background'
    },
    getSectionKey (container, target) {
      const section = container.querySelector('.page-sections__section[id]')
      const sectionId = section ? section.id : 'section'
      const customizationTarget = target.closest('[data-customization-key]')
      const customizationKey = customizationTarget && customizationTarget.dataset.customizationKey

      return `${this.$route.path}::${sectionId}${customizationKey ? `::${customizationKey}` : ''}`
    },
    getSectionLabel (container, target) {
      const section = container.querySelector('.page-sections__section[id]')
      const customizationTarget = target.closest('[data-customization-key]')
      const customizationKey = customizationTarget && customizationTarget.dataset.customizationKey

      if (customizationKey) {
        return customizationKey.replace(/[-_]/g, ' ')
      }

      return section ? section.id.replace(/[-_]/g, ' ') : 'this section'
    },
    clampToViewport () {
      const menu = this.$refs.menu

      if (!menu) {
        return
      }

      this.x = Math.max(viewportMargin, Math.min(this.x, window.innerWidth - menu.offsetWidth - viewportMargin))
      this.y = Math.max(viewportMargin, Math.min(this.y, window.innerHeight - menu.offsetHeight - viewportMargin))
    },
    handleOutsideMousedown (event) {
      if (!this.visible) {
        return
      }

      const menu = this.$refs.menu

      if (menu && event.target instanceof Element && !menu.contains(event.target)) {
        this.closeMenu()
      }
    },
    handleKeydown (event) {
      if (event.key === 'Escape') {
        this.closeMenu()
      }
    },
    closeMenu () {
      this.visible = false
    },
    getOverrideRef (role = this.role) {
      if (!this.sectionKey || !role) {
        return null
      }

      const overrides = this.theme?.sectionOverrides || {}

      return (overrides[this.sectionKey] || {})[role] || null
    },
    recordCheckpoint (role = this.role) {
      window.dispatchEvent(new CustomEvent(contextMenuCheckpointEvent, {
        detail: { editKey: `override:${this.sectionKey}:${role}` }
      }))
    },
    applyOverride (payload, role = this.role) {
      if (!this.sectionKey || !role) {
        return
      }

      this.recordCheckpoint(role)
      this.$store.dispatch('SET_SECTION_OVERRIDE', {
        sectionKey: this.sectionKey,
        role,
        slotRef: payload.ref
      })
    },
    resetOverride (role = this.role) {
      if (!this.getOverrideRef(role)) {
        return
      }

      this.recordCheckpoint(role)
      this.$store.dispatch('SET_SECTION_OVERRIDE', {
        sectionKey: this.sectionKey,
        role,
        slotRef: null
      })
    }
  }
}
</script>

<style lang='sass' src='./index.sass'></style>
