<template>
  <input
    :id="`checkbox_${props.item.id}`"
    autocomplete="off"
    type="checkbox"
    :value="props.item.value"
    :checked="props.item.value"
    :disabled="props.disabled"
  >

  <label :for="`checkbox_${props.item.id}`">
    <img src="./checkbox.svg">
  </label>
</template>

<script setup>
import './CheckboxField.scss'

const props = defineProps({
  item: {
    default: {
      id: 0,
      value: false
    },
    type: () => Object
  },
  disabled: {
    default: false,
    type: Boolean
  }
})
</script>
