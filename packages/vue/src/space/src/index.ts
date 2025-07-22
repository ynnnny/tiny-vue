import { $prefix, $props, $setup, defineComponent } from '@opentiny/vue-common'
import template from 'virtual-template?pc|mobile-first'

// Props 定义
export const spaceProps = {
  ...$props,
  size: [String, Number, Array],
  align: String,
  justify: String,
  direction: String,
  wrap: Boolean,
  order: {
    type: Array,
    default: () => []
  }
}

// 最终导出组件
export default defineComponent({
  name: $prefix + 'Space',
  props: spaceProps,
  setup(props, context) {
    return $setup({ props, context, template })
  }
})
