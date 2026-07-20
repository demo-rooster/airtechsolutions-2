import {
  DEV_INSPECTOR,
  DEV_TOOLS,
  SET_ACTIVE_THEME_NAME,
  SET_DEFAULT_THEME,
  SET_SECONDARY_THEME,
  SET_THEME,
  SET_THEME_PRESET,
  SET_THEME_PRESETS,
  UPDATE_THEME_COLOR,
  UPDATE_SCHEME_COLOR,
  SET_SCHEME_ASSIGNMENT,
  SET_SECTION_OVERRIDE,
  SET_CUSTOMIZATION_ENABLED,
  RESTORE_DEFAULT_THEME,
  IS_PHONE_LAND_LG,
  IS_PHONE_LG,
  IS_TABLET,
  IS_TABLET_LG,
  IS_TABLET_MD,
  SET_FORMS,
  SET_BLOG,
  SET_SERVICE_GUIDES,
  SET_GLOBAL,
  VIDEO_LOADING,
  VIEW_SITE,
  PAGE_CHANGE,
  SET_NAV
} from './mutation-types.js'
import { normalizeTheme, resolveThemeColors } from '~/resources/theme-scheme'

const cloneTheme = theme => JSON.parse(JSON.stringify(theme))

const stateMutations = () => ({
  [DEV_INSPECTOR] (state, data) {
    state.devInspector = data
  },
  [DEV_TOOLS] (state, data) {
    state.devTools = data
  },
  [SET_ACTIVE_THEME_NAME] (state, data) {
    state.activeThemeName = data
  },
  [SET_DEFAULT_THEME] (state, data) {
    state.defaultTheme = normalizeTheme(cloneTheme(data))
  },
  [SET_SECONDARY_THEME] (state, data) {
    state.secondaryTheme = normalizeTheme(cloneTheme(data))
  },
  [SET_THEME] (state, data) {
    state.theme = normalizeTheme(cloneTheme(data))
  },
  [SET_THEME_PRESET] (state, data) {
    state.themePresets = {
      ...state.themePresets,
      [data.name]: normalizeTheme(cloneTheme(data.theme))
    }
  },
  [SET_THEME_PRESETS] (state, data) {
    const presets = cloneTheme(data)

    Object.keys(presets).forEach((name) => {
      presets[name] = normalizeTheme(presets[name])
    })

    state.themePresets = presets
  },
  [UPDATE_THEME_COLOR] (state, data) {
    if (!state.theme || !state.theme.colors) {
      return
    }

    state.theme = {
      ...state.theme,
      colors: state.theme.colors.map((color) => {
        if (color.label !== data.label) {
          return color
        }

        return {
          ...color,
          ...data,
          color: {
            ...color.color,
            ...data.color
          }
        }
      })
    }
  },
  [UPDATE_SCHEME_COLOR] (state, data) {
    if (!state.theme || !Array.isArray(state.theme.scheme)) {
      return
    }

    const scheme = state.theme.scheme.map((family) => {
      if (family.key !== data.familyKey || !family[data.variant]) {
        return family
      }

      const slot = family[data.variant]

      return {
        ...family,
        [data.variant]: {
          ...slot,
          ...data.patch,
          color: {
            ...slot.color,
            ...data.patch.color
          }
        }
      }
    })

    state.theme = resolveThemeColors(cloneTheme({ ...state.theme, scheme }))
  },
  [SET_SCHEME_ASSIGNMENT] (state, data) {
    if (!state.theme || !state.theme.assignments) {
      return
    }

    state.theme = resolveThemeColors(cloneTheme({
      ...state.theme,
      assignments: {
        ...state.theme.assignments,
        [data.role]: data.slotRef
      }
    }))
  },
  [SET_SECTION_OVERRIDE] (state, data) {
    if (!state.theme) {
      return
    }

    const sectionOverrides = cloneTheme(state.theme.sectionOverrides || {})
    const section = { ...sectionOverrides[data.sectionKey] }

    if (data.slotRef) {
      section[data.role] = data.slotRef
    } else {
      delete section[data.role]
    }

    if (Object.keys(section).length) {
      sectionOverrides[data.sectionKey] = section
    } else {
      delete sectionOverrides[data.sectionKey]
    }

    state.theme = {
      ...state.theme,
      sectionOverrides
    }
  },
  [SET_CUSTOMIZATION_ENABLED] (state, data) {
    state.customizationEnabled = !!data
  },
  [RESTORE_DEFAULT_THEME] (state) {
    if (!state.defaultTheme) {
      return
    }

    state.theme = cloneTheme(state.defaultTheme)
  },
  [IS_PHONE_LAND_LG] (state, data) {
    state.isPhoneLandLg = data
  },
  [IS_PHONE_LG] (state, data) {
    state.isPhoneLg = data
  },
  [IS_TABLET] (state, data) {
    state.isTablet = data
  },
  [IS_TABLET_LG] (state, data) {
    state.isTabletLg = data
  },
  [IS_TABLET_MD] (state, data) {
    state.isTabletMd = data
  },
  [SET_FORMS] (state, data) {
    state.forms = data
  },
  [SET_BLOG] (state, data) {
    state.posts = data
  },
  [SET_SERVICE_GUIDES] (state, data) {
    state.serviceGuides = data
  },
  [SET_GLOBAL] (state, data) {
    state.global = data
  },
  [VIDEO_LOADING] (state, data) {
    state.videoIsLoading = data
  },
  [VIEW_SITE] (state, data) {
    state.siteLoaded = data
  },
  [PAGE_CHANGE] (state, data) {
    state.changing = data
  },
  [SET_NAV] (state, data) {
    state.noFloatTop = data
  }
})

export default stateMutations
