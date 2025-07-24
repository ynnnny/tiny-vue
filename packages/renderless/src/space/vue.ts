import type { SpaceApi } from '@/types'
import { getGapStyle, getAlignStyle, getJustifyStyle, getWrapStyle, getDirectionStyle, getSpaceStyle, getMarginBasedSpacing, getSupportsFlexboxGap } from './index'

export const api = [
  'getGapStyle',
  'getAlignStyle',
  'getJustifyStyle',
  'getWrapStyle',
  'getDirectionStyle',
  'getSpaceStyle',
  'getMarginBasedSpacing',
  'getSupportsFlexboxGap'
]

export const renderless = ({ props }): SpaceApi => {
  const partialApi = {
    getGapStyle: () => getGapStyle(props),
    getAlignStyle: () => getAlignStyle(props),
    getJustifyStyle: () => getJustifyStyle(props),
    getWrapStyle: () => getWrapStyle(props),
    getDirectionStyle: () => getDirectionStyle(props)
  }

  const api: SpaceApi = {
    ...partialApi,
    getSpaceStyle: () => getSpaceStyle(props),
    getMarginBasedSpacing: (itemIndex: number, totalItems: number) => getMarginBasedSpacing(props, itemIndex, totalItems),
    getSupportsFlexboxGap: () => getSupportsFlexboxGap()
  }

  return api
}
