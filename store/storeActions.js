import {
  DEV_INSPECTOR,
  DEV_TOOLS,
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
