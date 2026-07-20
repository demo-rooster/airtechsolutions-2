export const gradientTypes = ['linear', 'radial']
export const maxGradientStops = 3
export const minGradientStops = 2

export const linearDirectionOptions = [
  { label: 'Up', value: 0 },
  { label: 'Up right', value: 45 },
  { label: 'Right', value: 90 },
  { label: 'Down right', value: 135 },
  { label: 'Down', value: 180 },
  { label: 'Down left', value: 225 },
  { label: 'Left', value: 270 },
  { label: 'Up left', value: 315 }
]

export const radialPositionOptions = [
  { label: 'Center', value: 'center' },
  { label: 'Top', value: 'top' },
  { label: 'Top left', value: 'top left' },
  { label: 'Top right', value: 'top right' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Bottom left', value: 'bottom left' },
  { label: 'Bottom right', value: 'bottom right' }
]

const radialPositionValues = radialPositionOptions.map(option => option.value)

const legacyGradientPresets = {
  radialMist: { type: 'radial', position: 'top left' },
  cornerBloom: { type: 'radial', position: 'top right' },
  softHalo: { type: 'radial', position: 'top' },
  linearWash: { type: 'linear', angle: 135 },
  linearLift: { type: 'linear', angle: 180 }
}

const clampChannel = (value = 0) => Math.max(0, Math.min(255, Math.round(value)))

const toHexChannel = value => clampChannel(value).toString(16).padStart(2, '0')

const rgbToHex = (color = {}) => `#${toHexChannel(color.red)}${toHexChannel(color.green)}${toHexChannel(color.blue)}`.toUpperCase()

const tintHex = (color = {}) => rgbToHex({
  red: color.red * 0.68,
  green: color.green * 0.72,
  blue: color.blue * 0.68
})

const normalizeAngle = angle => ((angle % 360) + 360) % 360

const seedGradientColors = baseColor => ['#FFFFFF', tintHex(baseColor)]

export const normalizeGradient = (gradient, baseColor = {}) => {
  const defaults = {
    enabled: false,
    type: 'linear',
    angle: 135,
    position: 'center',
    colors: seedGradientColors(baseColor)
  }

  if (!gradient || gradient === 'solid') {
    return defaults
  }

  if (typeof gradient === 'string') {
    const legacyPreset = legacyGradientPresets[gradient]

    return legacyPreset ? { ...defaults, ...legacyPreset, enabled: true } : defaults
  }

  const colors = Array.isArray(gradient.colors) && gradient.colors.length >= minGradientStops
    ? gradient.colors.slice(0, maxGradientStops)
    : defaults.colors

  return {
    enabled: !!gradient.enabled,
    type: gradientTypes.includes(gradient.type) ? gradient.type : defaults.type,
    angle: Number.isFinite(gradient.angle) ? normalizeAngle(gradient.angle) : defaults.angle,
    position: radialPositionValues.includes(gradient.position) ? gradient.position : defaults.position,
    colors
  }
}

export const buildGradientCss = (gradient) => {
  const lastStopIndex = gradient.colors.length - 1
  const stops = gradient.colors
    .map((hex, index) => `${hex} ${Math.round((index / lastStopIndex) * 100)}%`)
    .join(', ')

  if (gradient.type === 'radial') {
    return `radial-gradient(circle at ${gradient.position}, ${stops})`
  }

  return `linear-gradient(${gradient.angle}deg, ${stops})`
}
