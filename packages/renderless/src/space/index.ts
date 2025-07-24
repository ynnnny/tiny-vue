import type { SpaceProps } from '@/types'

const sizeMap = {
  small: '8px',
  medium: '16px',
  large: '24px'
} as const

const parseGap = (gap: string | number): string => {
  if (typeof gap === 'number') return `${gap}px`
  if (gap in sizeMap) return sizeMap[gap as keyof typeof sizeMap]
  if (typeof gap === 'string') return gap
  return '0px'
}

// Check if CSS gap property is supported for flexbox
const supportsFlexboxGap = (() => {
  if (typeof document === 'undefined') return true // SSR fallback
  
  try {
    const testEl = document.createElement('div')
    testEl.style.display = 'flex'
    testEl.style.gap = '1px'
    return testEl.style.gap === '1px'
  } catch {
    return false
  }
})()

export const getGapStyle = (props: SpaceProps) => {
  const gapProp = props.size

  if (Array.isArray(gapProp)) {
    const [horizontal, vertical] = gapProp
    return {
      gap: `${parseGap(vertical)} ${parseGap(horizontal)}`
    }
  }

  return {
    gap: parseGap(gapProp)
  }
}

export const getAlignStyle = (props: SpaceProps) => ({
  alignItems: props.align || 'flex-start'
})

export const getJustifyStyle = (props: SpaceProps) => ({
  justifyContent: props.justify || 'flex-start'
})

export const getWrapStyle = (props: SpaceProps) => ({
  flexWrap: props.wrap ? 'wrap' : 'nowrap'
})

export const getDirectionStyle = (props: SpaceProps) => ({
  flexDirection: props.direction || 'row'
})

// Generate CSS for child spacing when gap is not supported
const generateChildSpacingCSS = (props: SpaceProps) => {
  const gapProp = props.size
  let horizontal = parseFloat(parseGap(Array.isArray(gapProp) ? gapProp[0] : gapProp))
  let vertical = parseFloat(parseGap(Array.isArray(gapProp) ? gapProp[1] || gapProp[0] : gapProp))

  const isRow = props.direction === 'row' || !props.direction
  const className = `tiny-space-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  let css = ''
  
  if (isRow) {
    // For row direction
    css = `
      .${className} > *:not(:last-child) {
        margin-right: ${horizontal}px;
      }
    `
    if (props.wrap) {
      css += `
        .${className} > * {
          margin-bottom: ${vertical}px;
        }
      `
    }
  } else {
    // For column direction
    css = `
      .${className} > *:not(:last-child) {
        margin-bottom: ${vertical}px;
      }
    `
    if (props.wrap) {
      css += `
        .${className} > * {
          margin-right: ${horizontal}px;
        }
      `
    }
  }

  return { css, className }
}

// Inject CSS into document head
const injectCSS = (css: string) => {
  if (typeof document === 'undefined') return

  const style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = css
  document.head.appendChild(style)
  
  return style
}

export const getSpaceStyle = (props: SpaceProps) => {
  const baseStyle = {
    display: 'flex',
    ...getDirectionStyle(props),
    ...getAlignStyle(props),
    ...getJustifyStyle(props),
    ...getWrapStyle(props)
  }

  // Use gap if supported
  if (supportsFlexboxGap) {
    return {
      ...baseStyle,
      ...getGapStyle(props)
    }
  }

  // For browsers without gap support, inject CSS and add class
  const { css, className } = generateChildSpacingCSS(props)
  injectCSS(css)

  return {
    ...baseStyle,
    className
  }
}

// Fallback function for browsers that don't support CSS gap
export const getMarginBasedSpacing = (props: SpaceProps, itemIndex: number, totalItems: number) => {
  if (supportsFlexboxGap) return {} // Use CSS gap if supported

  const gapProp = props.size
  let horizontal = 0
  let vertical = 0

  if (Array.isArray(gapProp)) {
    horizontal = parseFloat(parseGap(gapProp[0]))
    vertical = parseFloat(parseGap(gapProp[1]))
  } else {
    const gap = parseFloat(parseGap(gapProp))
    horizontal = gap
    vertical = gap
  }

  const isRow = props.direction === 'row' || !props.direction
  const isLast = itemIndex === totalItems - 1
  const marginStyle: Record<string, string> = {}

  if (isRow) {
    // For row direction, add right margin except for last item
    if (!isLast) {
      marginStyle.marginRight = `${horizontal}px`
    }
    // Add bottom margin for wrapping
    if (props.wrap) {
      marginStyle.marginBottom = `${vertical}px`
    }
  } else {
    // For column direction, add bottom margin except for last item
    if (!isLast) {
      marginStyle.marginBottom = `${vertical}px`
    }
    // Add right margin for wrapping
    if (props.wrap) {
      marginStyle.marginRight = `${horizontal}px`
    }
  }

  return marginStyle
}

export const getSupportsFlexboxGap = () => supportsFlexboxGap
