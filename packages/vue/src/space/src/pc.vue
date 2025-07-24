<template>
  <div 
    :class="['tiny-space', spaceStyles.className]" 
    :style="spaceStylesObject"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@opentiny/vue-common'
import { renderless } from '@opentiny/vue-renderless/space/vue'
import type { SpaceApi } from '@opentiny/vue-renderless/types/space.type'

export default defineComponent({
  name: 'TinySpace',
  props: {
    size: [String, Number, Array],
    align: String,
    justify: String,
    direction: {
      type: String,
      default: 'row'
    },
    wrap: {
      type: Boolean,
      default: false
    },
    order: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const api: SpaceApi = renderless({ props })
    const spaceStyles = api.getSpaceStyle()
    
    // Separate className from style object
    const { className, ...spaceStylesObject } = spaceStyles

    return {
      api,
      spaceStyles: { className },
      spaceStylesObject
    }
  }
})
</script>

<style scoped>
.tiny-space-item {
  display: inline-block;
}

/* Ensure child elements don't have conflicting margins */
.tiny-space-item > * {
  margin: 0;
}
</style>
