<template>
  <FormItem
    class="form-item__input"
    :required="props.item.required"
    :style="`--substring: ${props.item.substring != undefined ? props.item.substring : ''}`"
  >
    <FormLabel
      v-show="props.item.title != null && props.item.title != ''"
      :title="props.item.title"
    />

    <FormValue
      v-if="props.isReadOnly"
      :is-h-t-m-l="false"
      :is-link="props.isLink"
      :value="props.item.value"
      @click="() => props.isLink ? $emit('openLink', props.item) : ''"
    />

    <InputField
      v-else
      ref="inputRef"
      :item="props.item"
      :mask="props.mask"
      :disabled="props.disabled"
      :enabled-autocomplete="props.enabledAutocomplete"
      @focus="(data) => $emit('focus', data)"
      @blur="(data) => $emit('blur', data)"
      @change-value="(data) => $emit('changeValue', data)"
    />

    <span
      v-if="![null, undefined].includes(props.item.substring) && props.item.substring != ''"
      class="form-item__substring"
    >{{ props.item.substring }}</span>

    <slot />
  </FormItem>
</template>

<script setup>
import './Input.scss'

import { ref } from 'vue'

import InputField from './InputField/InputField.vue'
import FormItem from '@/components/AppForm/FormItem/FormItem.vue'
import FormLabel from '@/components/AppForm/FormLabel/FormLabel.vue'
import FormValue from '@/components/AppForm/FormValue/FormValue.vue'

const inputRef = ref(null)

defineEmits(['changeValue', 'blur', 'focus', 'openLink'])

const props = defineProps({
  item: {
    default: {
      id: 0,
      key: '',
      value: '',
      type: 'text',
      focus: false,
      placeholder: '',
      substring: null,
      title: 'Undefined title'
    },
    type: () => Object
  },
  disabled: {
    default: false,
    type: Boolean
  },
  enabledAutocomplete: {
    default: true,
    type: Boolean
  },
  mask: {
    default: null,
    type: String
  },
  isReadOnly: {
    default: false,
    type: Boolean
  },
  isLink: {
    default: false,
    type: Boolean
  }
})

defineExpose({
  inputRef
})
</script>
