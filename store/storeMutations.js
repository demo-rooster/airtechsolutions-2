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
} from './mutation-types.js'

const stateMutations = () => ({
  [DEV_INSPECTOR] (state, data) {
    state.devInspector = data
  },
  [DEV_TOOLS] (state, data) {
    state.devTools = data
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
