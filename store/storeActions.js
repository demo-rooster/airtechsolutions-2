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
} from './mutation-types'

const stateActions = () => ({
  DEV_INSPECTOR ({ commit }, data) {
    commit(DEV_INSPECTOR, data)
  },
  DEV_TOOLS ({ commit }, data) {
    commit(DEV_TOOLS, data)
  },
  SET_ACTIVE_THEME_NAME ({ commit }, data) {
    commit(SET_ACTIVE_THEME_NAME, data)
  },
  SET_DEFAULT_THEME ({ commit }, data) {
    commit(SET_DEFAULT_THEME, data)
  },
  SET_SECONDARY_THEME ({ commit }, data) {
    commit(SET_SECONDARY_THEME, data)
  },
  SET_THEME ({ commit }, data) {
    commit(SET_THEME, data)
  },
  SET_THEME_PRESET ({ commit }, data) {
    commit(SET_THEME_PRESET, data)
  },
  SET_THEME_PRESETS ({ commit }, data) {
    commit(SET_THEME_PRESETS, data)
  },
  UPDATE_THEME_COLOR ({ commit }, data) {
    commit(UPDATE_THEME_COLOR, data)
  },
  UPDATE_SCHEME_COLOR ({ commit }, data) {
    commit(UPDATE_SCHEME_COLOR, data)
  },
  SET_SCHEME_ASSIGNMENT ({ commit }, data) {
    commit(SET_SCHEME_ASSIGNMENT, data)
  },
  SET_SECTION_OVERRIDE ({ commit }, data) {
    commit(SET_SECTION_OVERRIDE, data)
  },
  SET_CUSTOMIZATION_ENABLED ({ commit }, data) {
    commit(SET_CUSTOMIZATION_ENABLED, data)
  },
  RESTORE_DEFAULT_THEME ({ commit }) {
    commit(RESTORE_DEFAULT_THEME)
  },
  IS_PHONE_LAND_LG ({ commit }, data) {
    commit(IS_PHONE_LAND_LG, data)
  },
  IS_PHONE_LG ({ commit }, data) {
    commit(IS_PHONE_LG, data)
  },
  IS_TABLET ({ commit }, data) {
    commit(IS_TABLET, data)
  },
  IS_TABLET_LG ({ commit }, data) {
    commit(IS_TABLET_LG, data)
  },
  IS_TABLET_MD ({ commit }, data) {
    commit(IS_TABLET_MD, data)
  },
  SET_FORMS ({ commit }, data) {
    commit(SET_FORMS, data)
  },
  SET_BLOG ({ commit }, data) {
    commit(SET_BLOG, data)
  },
  SET_SERVICE_GUIDES ({ commit }, data) {
    commit(SET_SERVICE_GUIDES, data)
  },
  SET_GLOBAL ({ commit }, data) {
    commit(SET_GLOBAL, data)
  },
  VIDEO_LOADING ({ commit }, data) {
    commit(VIDEO_LOADING, data)
  },
  VIEW_SITE ({ commit }, data) {
    commit(VIEW_SITE, data)
  },
  PAGE_CHANGE ({ commit }, data) {
    commit(PAGE_CHANGE, data)
  },
  SET_NAV ({ commit }, data) {
    commit(SET_NAV, data)
  }
})

export default stateActions
