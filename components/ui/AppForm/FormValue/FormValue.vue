<template>
  <span
    v-if="props.isHTML"
    class="form-item__value"
    :class="setClasses"
    @click="() => openLink()"
    v-html="props.value"
  />
  <span
    v-else
    class="form-item__value"
    :class="setClasses"
    @click="() => openLink()"
  >
    {{ props.value }}
  </span>
</template>

<script setup>
import './FormValue.scss'

import { computed } from 'vue'

const props = defineProps({
  value: {
    default: null
  },
  isHTML: {
    default: false,
    type: Boolean
  },
  isLink: {
    default: false,
    type: Boolean
  },
  link: {
    default: null,
    type: String
  }
})

// Установка CSS-классов
const setClasses = computed(() => {
  return [
    [null, undefined].includes(props.value) || props.value == '' ? 'form-item__value_empty' : '',
    props.isHTML ? 'form-item__value_html' : '',
    props.isLink ? 'form-item__value-link' : ''
  ]
})

// Открытие ссылки в новой вкладке
const openLink = () => {
  if (![null, undefined].includes(props.link)) {
    window.open(props.link, '_blank')
  }
}
</script>
