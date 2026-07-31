import themeData from '@/data/theme.json'
import { buildLogoStyleVars, buildSectionStyleVars, elementRoleCategories, getLogoPaintColors, logoPaintRoles, normalizeTheme } from '@/resources/theme-scheme'

const logoPaletteRoleKeys = [
  'logo-base',
  'logo-green-light',
  'logo-green',
  'logo-green-dark',
  'logo-blue'
]

describe('site theme presets', () => {
  test('uses the saved customization as the Theme 2 baseline', () => {
    const theme = normalizeTheme(themeData.secondary)

    expect(theme.assignments).toMatchObject({
      'titles-light': 'quinary.dark',
      'btn-background': 'secondary.dark',
      'header-footer': 'primary.dark'
    })
    expect(theme.scheme.find(family => family.key === 'primary').dark.hex).toBe('#7988A6')
    expect(theme.logo.wave1).toMatchObject({ source: 'custom', mode: 'solid' })
    expect(theme.sectionOverrides['/::hero-0']).toEqual({
      background: 'secondary.dark',
      'btn-background': 'tertiary.dark'
    })
    expect(theme.sectionOverrides['/services::service_navigation-1']).toEqual({
      titles: 'quinary.dark',
      text: 'quinary.dark'
    })
  })
})

describe('logo theme colors', () => {
  test('exposes semantic paint names in the Logo category', () => {
    const logoCategory = elementRoleCategories.find(category => category.key === 'logo')

    expect(logoCategory.label).toBe('Logo')
    expect(logoPaintRoles.map(role => role.name)).toEqual(['Base', 'Lettering', 'Wave 1', 'Wave 2'])
  })

  test('normalizes theme-based solid and gradient defaults', () => {
    const theme = normalizeTheme(themeData.default)

    expect(theme.logo.base).toMatchObject({ source: 'theme', mode: 'solid' })
    expect(theme.logo.lettering).toMatchObject({ source: 'theme', mode: 'gradient' })
    expect(getLogoPaintColors(theme, 'lettering')).toEqual(['#D6E7F5', '#ADC8E8', '#7FA4CC'])
    expect(buildLogoStyleVars(theme)).toMatchObject({
      '--logo-base-1': 'rgba(255, 255, 255, 1)',
      '--logo-lettering-1': 'rgba(214, 231, 245, 1)',
      '--logo-lettering-2': 'rgba(173, 200, 232, 1)',
      '--logo-lettering-3': 'rgba(127, 164, 204, 1)',
      '--logo-wave-2-1': 'rgba(2, 67, 127, 1)'
    })
  })

  test('preserves custom gradient colors through normalization', () => {
    const theme = normalizeTheme(themeData.default)
    const customTheme = normalizeTheme({
      ...theme,
      logo: {
        ...theme.logo,
        wave2: {
          ...theme.logo.wave2,
          source: 'custom',
          mode: 'gradient',
          customColors: ['#112233', '#445566', '#778899']
        }
      }
    })

    expect(getLogoPaintColors(customTheme, 'wave2')).toEqual(['#112233', '#445566', '#778899'])
  })

  test('adds semantic paints to themes saved before logo settings existed', () => {
    const theme = normalizeTheme(themeData.default)
    const legacyAssignments = { ...theme.assignments }

    logoPaletteRoleKeys.forEach(key => delete legacyAssignments[key])

    const normalizedLegacyTheme = normalizeTheme({ ...theme, logo: undefined, assignments: legacyAssignments })

    logoPaletteRoleKeys.forEach((key) => {
      expect(normalizedLegacyTheme.assignments[key]).toBeTruthy()
    })
    expect(Object.keys(normalizedLegacyTheme.logo)).toEqual(['base', 'lettering', 'wave1', 'wave2'])
  })
})

describe('section button colors', () => {
  test('emits all button color overrides as section variables', () => {
    const sectionKey = '/::hero'
    const theme = normalizeTheme({
      ...themeData.default,
      sectionOverrides: {
        [sectionKey]: {
          'btn-background': 'primary.dark',
          'btn-text': 'neutral.light',
          'btn-hover-background': 'transparent',
          'btn-hover-text': 'primary.light'
        }
      }
    })

    expect(buildSectionStyleVars(theme, sectionKey, 'bg-1')).toMatchObject({
      '--btn-background': 'rgba(0, 57, 112, 1)',
      '--btn-text': 'rgba(255, 255, 255, 1)',
      '--btn-hover-background': 'rgba(255, 255, 255, 0)',
      '--btn-hover-text': 'rgba(173, 200, 232, 1)',
      '--section-override-btn-background': 'rgba(0, 57, 112, 1)',
      '--section-override-btn-text': 'rgba(255, 255, 255, 1)',
      '--section-override-btn-hover-background': 'rgba(255, 255, 255, 0)',
      '--section-override-btn-hover-text': 'rgba(173, 200, 232, 1)'
    })
  })
})

describe('section title colors', () => {
  test('uses a preferred title role by default while preserving section overrides', () => {
    const sectionKey = '/about::hero'
    const theme = normalizeTheme(themeData.default)

    expect(buildSectionStyleVars(theme, sectionKey, null, 'titles-dark')).toMatchObject({
      '--headers': 'rgba(255, 255, 255, 1)'
    })

    const overriddenTheme = normalizeTheme({
      ...theme,
      sectionOverrides: {
        [sectionKey]: {
          titles: 'primary.dark'
        }
      }
    })

    expect(buildSectionStyleVars(overriddenTheme, sectionKey, null, 'titles-dark')).toMatchObject({
      '--headers': 'rgba(0, 57, 112, 1)',
      '--section-override-headers': 'rgba(0, 57, 112, 1)'
    })
  })
})
