<template lang='pug' src='./index.pug'></template>

<script>
import { buildGradientCss, maxGradientStops, minGradientStops, normalizeGradient, radialPositionOptions } from '~/resources/gradients'
import { elementRoleCategories, elementRoles, getLogoPaintColors, getSlotValue, hexToRgb, logoPaintRoles, normalizeHex, parseSlotRef, popupRoles, slotCssValue, topbarRoles, transparentSlotRef } from '~/resources/theme-scheme'

const activeThemeStorageKey = 'rg-active-theme-v3'
const themePresetNames = ['primary', 'secondary', 'tertiary', 'quaternary']
const themePresetsStorageKey = 'rg-theme-presets-v1'
const themePresetsStorageVersion = 'theme-presets-data-2'
const backgroundColorLabels = ['bg-1', 'bg-2']
const contextMenuCheckpointEvent = 'rg-theme-checkpoint'
const historyLimit = 50
const historyCoalesceMs = 1000
const cloneTheme = theme => JSON.parse(JSON.stringify(theme))

export default {
  data: () => ({
    isOpen: false,
    activeTab: 'colors',
    activeSlotRef: null,
    activeRoleKey: null,
    activeLogoPaintKey: null,
    activeRoleCategory: elementRoleCategories[0].key,
    roleCategories: elementRoleCategories,
    tabs: [
      { key: 'colors', label: 'Colors' },
      { key: 'header', label: 'Header' },
      { key: 'popup', label: 'Pop-Up' }
    ],
    copiedColor: null,
    shareThemeCopied: false,
    shareThemeTimer: null,
    undoStack: [],
    redoStack: [],
    lastEditKey: null,
    lastEditAt: 0,
    fillModeOptions: [
      { label: 'Solid', value: false },
      { label: 'Gradient', value: true }
    ],
    logoSourceOptions: [
      { label: 'Theme', value: 'theme' },
      { label: 'Custom', value: 'custom' }
    ],
    logoFillModeOptions: [
      { label: 'Solid', value: 'solid' },
      { label: 'Gradient', value: 'gradient' }
    ],
    gradientTypeOptions: [
      { label: 'Linear', value: 'linear' },
      { label: 'Radial', value: 'radial' }
    ],
    radialPositionOptions,
    headerTypeOptions: [
      { label: 'Links', value: 'links' },
      { label: 'Announcement', value: 'announcement' }
    ],
    headerThemeOptions: [
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' }
    ],
    headerAlignmentOptions: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' }
    ],
    popupPageOptions: [
      { label: 'Home', value: 'home' },
      { label: 'All pages', value: 'all' }
    ],
    popupFrequencyOptions: [
      { label: 'First visit', value: 'first' },
      { label: 'Every visit', value: 'every' }
    ],
    headerIconOptions: [
      { label: 'Phone', value: 'phone' },
      { label: 'Envelope', value: 'envelope' },
      { label: 'Location pin', value: 'location-pin' },
      { label: 'Map pin', value: 'map-pin' },
      { label: 'Message', value: 'message' },
      { label: 'Notification', value: 'notification' },
      { label: 'Star', value: 'star' }
    ]
  }),
  computed: {
    themeScheme () {
      return this.$store.state.theme?.scheme || []
    },
    themeAssignments () {
      return this.$store.state.theme?.assignments || {}
    },
    activeSlotParsed () {
      return parseSlotRef(this.activeSlotRef)
    },
    activeSlotFamily () {
      if (!this.activeSlotParsed) {
        return null
      }

      return this.themeScheme.find(family => family.key === this.activeSlotParsed.familyKey) || null
    },
    activeSlot () {
      if (!this.activeSlotFamily) {
        return null
      }

      return this.activeSlotFamily[this.activeSlotParsed.variant] || null
    },
    activeSlotLocked () {
      return !!(this.activeSlotFamily && this.activeSlotFamily.locked)
    },
    activeSlotName () {
      if (!this.activeSlotFamily) {
        return ''
      }

      const variantLabel = this.activeSlotParsed.variant === 'light' ? 'Light' : 'Dark'

      return `${this.activeSlotFamily.name || this.activeSlotFamily.key} (${variantLabel})`
    },
    activeSlotHex () {
      return this.activeSlot ? normalizeHex(this.activeSlot.hex) : ''
    },
    activeSlotAllowsGradient () {
      return backgroundColorLabels.some(label => this.themeAssignments[label] === this.activeSlotRef)
    },
    activeSlotGradient () {
      return this.activeSlot ? normalizeGradient(this.activeSlot.gradient, this.activeSlot.color) : null
    },
    activeSlotGradientEnabled () {
      return !!(this.activeSlotGradient && this.activeSlotGradient.enabled)
    },
    elementRoleRows () {
      return this.buildRoleRows(elementRoles)
    },
    topbarRoleRows () {
      return this.buildRoleRows(topbarRoles)
    },
    popupRoleRows () {
      return this.buildRoleRows(popupRoles)
    },
    visibleRoleRows () {
      return this.elementRoleRows.filter(role => role.category === this.activeRoleCategory)
    },
    logoPaintRows () {
      const theme = this.$store.state.theme

      return logoPaintRoles.map((role) => {
        const paint = theme?.logo?.[role.key] || {}
        const colors = getLogoPaintColors(theme, role.key)
        const background = paint.mode === 'gradient'
          ? `linear-gradient(135deg, ${colors.join(', ')})`
          : colors[0]

        return {
          ...role,
          ...paint,
          colors,
          chipStyle: background ? { background } : {}
        }
      })
    },
    activeLogoPaint () {
      return this.logoPaintRows.find(paint => paint.key === this.activeLogoPaintKey) || null
    },
    activeLogoColorIndexes () {
      return this.activeLogoPaint?.mode === 'gradient' ? [0, 1, 2] : [0]
    },
    activeRole () {
      return [...this.elementRoleRows, ...this.topbarRoleRows, ...this.popupRoleRows]
        .find(role => role.key === this.activeRoleKey) || null
    },
    themeHeader () {
      return this.$store.state.theme?.header || null
    },
    themePopup () {
      return this.$store.state.theme?.popup || null
    },
    popupPagesValue () {
      return this.themePopup?.pages || 'home'
    },
    popupFrequencyValue () {
      return this.themePopup?.frequency || 'every'
    },
    topbarLinks () {
      return this.themeHeader?.links || []
    },
    headerAnnouncement () {
      return this.themeHeader?.announcement || {}
    },
    activeThemeName () {
      return this.$store.state.activeThemeName
    },
    activeThemeLabel () {
      return this.themePresetLabel(this.activeThemeName)
    },
    themePresetButtons () {
      return themePresetNames.map(name => ({
        name,
        label: this.themePresetLabel(name)
      }))
    },
    hasUnsavedChanges () {
      const theme = this.$store.state.theme
      const activePreset = this.$store.state.themePresets[this.activeThemeName]

      if (!theme || !activePreset) {
        return false
      }

      return JSON.stringify(theme) !== JSON.stringify(activePreset)
    }
  },
  mounted () {
    window.addEventListener(contextMenuCheckpointEvent, this.handleExternalCheckpoint)
  },
  beforeDestroy () {
    window.clearTimeout(this.shareThemeTimer)
    window.removeEventListener(contextMenuCheckpointEvent, this.handleExternalCheckpoint)
  },
  methods: {
    toggleToolbar () {
      this.isOpen = !this.isOpen
    },
    handleExternalCheckpoint (event) {
      const editKey = event?.detail?.editKey || 'context-menu'

      this.recordHistoryCheckpoint(editKey, true)
    },
    toggleSlotEditor (payload) {
      this.activeRoleKey = null
      this.activeSlotRef = this.activeSlotRef === payload.ref ? null : payload.ref
    },
    closeSlotEditor () {
      this.activeSlotRef = null
    },
    buildRoleRows (roles) {
      return roles.map((role) => {
        const ref = this.themeAssignments[role.key] || null
        const value = getSlotValue(this.themeScheme, ref)
        const isTransparent = ref === transparentSlotRef
        const chipValue = value && !role.allowsGradient ? { ...value, gradient: undefined } : value

        return {
          ...role,
          ref,
          isTransparent,
          hex: value && !isTransparent ? normalizeHex(value.hex) : '',
          chipStyle: chipValue && !isTransparent ? { background: slotCssValue(chipValue) } : {}
        }
      })
    },
    setRoleCategory (categoryKey) {
      if (this.activeRoleCategory === categoryKey) {
        return
      }

      this.activeRoleCategory = categoryKey
      this.activeRoleKey = null
      this.activeLogoPaintKey = null
    },
    toggleRolePicker (roleKey) {
      this.activeSlotRef = null
      this.activeLogoPaintKey = null
      this.activeRoleKey = this.activeRoleKey === roleKey ? null : roleKey
    },
    assignRole (payload) {
      if (!this.activeRole) {
        return
      }

      this.recordHistoryCheckpoint(`assign:${this.activeRole.key}`, true)
      this.$store.dispatch('SET_SCHEME_ASSIGNMENT', {
        role: this.activeRole.key,
        slotRef: payload.ref
      })
    },
    toggleLogoPaintEditor (paintKey) {
      this.activeSlotRef = null
      this.activeRoleKey = null
      this.activeLogoPaintKey = this.activeLogoPaintKey === paintKey ? null : paintKey
    },
    updateLogoPaint (patch, editKey, force = false) {
      const theme = this.$store.state.theme

      if (!theme || !this.activeLogoPaint) {
        return
      }

      this.recordHistoryCheckpoint(editKey, force)
      this.$store.dispatch('SET_THEME', {
        ...theme,
        logo: {
          ...cloneTheme(theme.logo || {}),
          [this.activeLogoPaint.key]: {
            ...cloneTheme(theme.logo[this.activeLogoPaint.key]),
            ...patch
          }
        }
      })
    },
    setLogoPaintSource (source) {
      const patch = { source }

      if (source === 'custom') {
        patch.customColors = [...this.activeLogoPaint.colors]
      }

      this.updateLogoPaint(patch, `logo:${this.activeLogoPaint.key}:source`, true)
    },
    setLogoPaintMode (mode) {
      this.updateLogoPaint({ mode }, `logo:${this.activeLogoPaint.key}:mode`, true)
    },
    setLogoThemeRef (index, payload) {
      const themeRefs = [...this.activeLogoPaint.themeRefs]

      themeRefs.splice(index, 1, payload.ref)
      this.updateLogoPaint({ themeRefs }, `logo:${this.activeLogoPaint.key}:theme-${index}`, true)
    },
    setLogoCustomColor (index, value) {
      if (!hexToRgb(value)) {
        return
      }

      const customColors = [...this.activeLogoPaint.customColors]

      customColors.splice(index, 1, normalizeHex(value))
      this.updateLogoPaint({ customColors }, `logo:${this.activeLogoPaint.key}:custom-${index}`)
    },
    updateActiveSlot (patch, editKey, force = false) {
      if (!this.activeSlotParsed) {
        return
      }

      this.recordHistoryCheckpoint(editKey, force)
      this.$store.dispatch('UPDATE_SCHEME_COLOR', {
        familyKey: this.activeSlotParsed.familyKey,
        variant: this.activeSlotParsed.variant,
        patch
      })
    },
    handleSchemeColorInput (value) {
      const rgb = hexToRgb(value)

      if (!rgb) {
        return
      }

      this.updateActiveSlot({
        hex: normalizeHex(value),
        color: {
          red: rgb.red,
          green: rgb.green,
          blue: rgb.blue,
          alpha: 1
        }
      }, `scheme:${this.activeSlotRef}`)
    },
    updateActiveSlotGradient (patch, editKey, force = false) {
      if (!this.activeSlotGradient) {
        return
      }

      this.updateActiveSlot({
        gradient: {
          ...this.activeSlotGradient,
          ...patch
        }
      }, editKey, force)
    },
    setSlotGradientEnabled (enabled) {
      if (this.activeSlotGradientEnabled === enabled) {
        return
      }

      this.updateActiveSlotGradient({ enabled }, `gradient:${this.activeSlotRef}-mode`, true)
    },
    setSlotGradientType (type) {
      this.updateActiveSlotGradient({ type }, `gradient:${this.activeSlotRef}-type`, true)
    },
    handleSlotGradientAngleInput (value) {
      this.updateActiveSlotGradient({ angle: Number(value) }, `gradient:${this.activeSlotRef}-angle`)
    },
    handleSlotGradientPositionInput (position) {
      this.updateActiveSlotGradient({ position }, `gradient:${this.activeSlotRef}-position`, true)
    },
    handleSlotGradientStopInput (index, value) {
      const colors = [...this.activeSlotGradient.colors]

      colors.splice(index, 1, normalizeHex(value))
      this.updateActiveSlotGradient({ colors }, `gradient:${this.activeSlotRef}-stop-${index}`)
    },
    addSlotGradientStop () {
      const colors = [...this.activeSlotGradient.colors]

      if (colors.length >= maxGradientStops) {
        return
      }

      colors.push(this.activeSlotHex)
      this.updateActiveSlotGradient({ colors }, `gradient:${this.activeSlotRef}-add-stop`, true)
    },
    removeSlotGradientStop (index) {
      const colors = [...this.activeSlotGradient.colors]

      if (colors.length <= minGradientStops) {
        return
      }

      colors.splice(index, 1)
      this.updateActiveSlotGradient({ colors }, `gradient:${this.activeSlotRef}-remove-stop`, true)
    },
    slotGradientPreviewStyle () {
      return this.activeSlotGradient ? { background: buildGradientCss(this.activeSlotGradient) } : {}
    },
    canAddSlotGradientStop () {
      return !!this.activeSlotGradient && this.activeSlotGradient.colors.length < maxGradientStops
    },
    canRemoveSlotGradientStop () {
      return !!this.activeSlotGradient && this.activeSlotGradient.colors.length > minGradientStops
    },
    copySlotColor () {
      if (!this.activeSlot) {
        return
      }

      this.copiedColor = {
        label: this.activeSlotName,
        hex: this.activeSlotHex
      }
    },
    applyCopiedColor () {
      if (!this.copiedColor || this.activeSlotLocked) {
        return
      }

      this.handleSchemeColorInput(this.copiedColor.hex)
    },
    copyButtonLabel () {
      return `Copy ${this.activeSlotName} color`
    },
    applyButtonLabel () {
      if (!this.copiedColor) {
        return `Copy a color before applying to ${this.activeSlotName}`
      }

      return `Apply ${this.copiedColor.label} color to ${this.activeSlotName}`
    },
    updateThemeHeader (patch, editKey, force = false) {
      const theme = this.$store.state.theme

      if (!theme) {
        return
      }

      this.recordHistoryCheckpoint(editKey, force)
      this.$store.dispatch('SET_THEME', {
        ...theme,
        header: {
          ...cloneTheme(theme.header || {}),
          ...patch
        }
      })
    },
    updateThemePopup (patch, editKey, force = false) {
      const theme = this.$store.state.theme

      if (!theme) {
        return
      }

      this.recordHistoryCheckpoint(editKey, force)
      this.$store.dispatch('SET_THEME', {
        ...theme,
        popup: {
          ...cloneTheme(theme.popup || {}),
          ...patch
        }
      })
    },
    updateAnnouncement (patch, editKey, force = false) {
      this.updateThemeHeader({
        announcement: {
          ...cloneTheme(this.headerAnnouncement),
          ...patch
        }
      }, editKey, force)
    },
    addTopbarLink () {
      const links = cloneTheme(this.topbarLinks)

      links.push({
        icon: 'phone',
        text: '',
        label: '',
        href: '',
        new_window: false
      })

      this.updateThemeHeader({ links }, 'header:add-link', true)
    },
    removeTopbarLink (index) {
      const links = cloneTheme(this.topbarLinks)

      links.splice(index, 1)
      this.updateThemeHeader({ links }, `header:remove-link-${index}`, true)
    },
    updateTopbarLink (index, patch, editKey, force = false) {
      const links = cloneTheme(this.topbarLinks)

      if (!links[index]) {
        return
      }

      links[index] = {
        ...links[index],
        ...patch
      }

      this.updateThemeHeader({ links }, editKey, force)
    },
    recordHistoryCheckpoint (editKey, force = false) {
      const theme = this.$store.state.theme

      if (!theme) {
        return
      }

      const now = Date.now()
      const isNewEdit = force || editKey !== this.lastEditKey || now - this.lastEditAt > historyCoalesceMs

      this.lastEditKey = editKey
      this.lastEditAt = now

      if (!isNewEdit) {
        return
      }

      this.undoStack.push(cloneTheme(theme))

      if (this.undoStack.length > historyLimit) {
        this.undoStack.shift()
      }

      this.redoStack = []
    },
    undoThemeChange () {
      if (!this.undoStack.length || !this.$store.state.theme) {
        return
      }

      this.redoStack.push(cloneTheme(this.$store.state.theme))
      this.applyThemeSnapshot(this.undoStack.pop())
    },
    redoThemeChange () {
      if (!this.redoStack.length || !this.$store.state.theme) {
        return
      }

      this.undoStack.push(cloneTheme(this.$store.state.theme))
      this.applyThemeSnapshot(this.redoStack.pop())
    },
    applyThemeSnapshot (theme) {
      this.lastEditKey = null
      this.$store.dispatch('SET_THEME', theme)
    },
    clearThemeHistory () {
      this.undoStack = []
      this.redoStack = []
      this.lastEditKey = null
    },
    setThemePreset (name) {
      if (!this.$store.state.themePresets[name]) {
        return
      }

      window.localStorage.setItem(activeThemeStorageKey, name)
      this.$store.dispatch('SET_ACTIVE_THEME_NAME', name)
      this.$store.dispatch('SET_THEME', this.$store.state.themePresets[name])
      this.clearThemeHistory()
    },
    saveActiveThemePreset () {
      if (!this.$store.state.theme) {
        return
      }

      const theme = this.$store.state.theme
      const themePresets = {
        ...this.$store.state.themePresets,
        [this.activeThemeName]: theme
      }

      window.localStorage.setItem(themePresetsStorageKey, JSON.stringify({ version: themePresetsStorageVersion, presets: themePresets }))
      window.localStorage.setItem(activeThemeStorageKey, this.activeThemeName)
      this.$store.dispatch('SET_THEME_PRESET', { name: this.activeThemeName, theme })
    },
    themePresetLabel (name) {
      return `Theme ${themePresetNames.indexOf(name) + 1}`
    },
    async shareTheme () {
      const theme = this.$store.state.theme

      if (!theme) {
        return
      }

      const copied = await this.copyTextToClipboard(JSON.stringify(theme, null, 2))

      if (!copied) {
        return
      }

      this.shareThemeCopied = true
      window.clearTimeout(this.shareThemeTimer)
      this.shareThemeTimer = window.setTimeout(() => {
        this.shareThemeCopied = false
      }, 2000)
    },
    async copyTextToClipboard (text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text)
          return true
        } catch (error) {
          return this.fallbackCopyTextToClipboard(text)
        }
      }

      return this.fallbackCopyTextToClipboard(text)
    },
    fallbackCopyTextToClipboard (text) {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()

      let copied = false

      try {
        copied = document.execCommand('copy')
      } catch (error) {
        copied = false
      }

      document.body.removeChild(textarea)
      return copied
    }
  }
}
</script>

<style lang='sass' src='./index.sass'></style>
