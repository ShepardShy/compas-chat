<template>
  <div
    ref="formItemRef"
    class="form__item"
    :class="setClasses"
  >
    <slot />
  </div>
</template>

<script setup>
import './FormItem.scss'

import { ref, computed } from 'vue'

const formItemRef = ref(null)

const props = defineProps({
  required: {
    default: false,
    type: Boolean
  },
  isReadOnly: {
    default: false,
    type: Boolean
  }
})

const setClasses = computed(() => {
  return [
    props.required ? 'form-item_required' : '',
    props.isReadOnly ? 'form-item_readonly' : ''
  ]
})

defineExpose({
  formItemRef
})
</script>
