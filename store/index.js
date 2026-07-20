import storeActions from './storeActions'
import storeMutations from './storeMutations'

export const state = () => ({
  devInspector: false,
  devTools: false,
  activeThemeName: 'primary',
  defaultTheme: null,
  secondaryTheme: null,
  themePresets: {},
  theme: null,
  customizationEnabled: false,
  forms: null,
  posts: null,
  serviceGuides: null,
  global: null,
  isPhoneLandLg: false,
  isPhoneLg: false,
  isTablet: false,
  isTabletLg: false,
  isTabletMd: false,
  videoIsLoading: true,
  siteLoaded: false,
  changing: false,
  noFloatTop: false
})

export const actions = storeActions()

export const mutations = storeMutations()
