<template>
  <div
    v-if="props.isHTML"
    class="form-item__title"
    v-html="props.title"
  />

  <FormLabel
    v-else
    :title="props.title"
  />
</template>

<script setup>
import './CheckboxLabel.scss'

import FormLabel from '@/components/AppForm/FormLabel/FormLabel.vue'

const props = defineProps({
  title: {
    default: null
  },
  isHTML: {
    default: false,
    type: Boolean
  }
})
</script>
