<template>
  <FormItem
    class="file form-item__file"
    :required="props.item.required"
  >
    <FormLabel
      v-show="props.item.title != null && props.item.title != ''"
      :title="props.item.title"
    />

    <FileField
      :item="props.item"
      :is-read-only="props.isReadOnly"
      :is-show-file-name="props.isShowFileName"
      :is-multiple="props.isMultiple"
      :is-one-file="props.isOneFile"
      :is-icon="props.isIcon"
      @change-value="(data) => emit('changeValue', data)"
      @init-edit="(event) => emit('initEdit', event)"
    />
  </FormItem>
</template>

<script setup>
import './File.scss'

import FileField from './Field/Field.vue'
import FormItem from '@/components/AppForm/FormItem/FormItem.vue'
import FormLabel from '@/components/AppForm/FormLabel/FormLabel.vue'

const props = defineProps({
  item: {
    default: {
      id: 1517,
      title: 'Undefined title',
      type: 'file',
      key: '',
      required: false,
      focus: true,
      value: null,
      buttonName: ''
    },
    type: Object
  },
  isReadOnly: {
    default: false,
    type: Boolean
  },
  isShowFileName: {
    default: false,
    type: Boolean
  },
  isMultiple: {
    default: false,
    type: Boolean
  },
  isOneFile: {
    default: false,
    type: Boolean
  },
  isIcon: {
    default: false,
    type: Boolean
  }
})

const emit = defineEmits([
  'changeValue',
  'initEdit'
])
</script>
