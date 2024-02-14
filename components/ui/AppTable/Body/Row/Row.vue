<template>
  <tr
    ref="rowRef"
    v-click-out-side="(event) => clickRow(false)"
    class="table__row"
    :class="{
      'table__row_edit': props.row.isEdit,
      'table__row_choosed': props.row.isChoose,
      'table__row_updated': props.row.isUpdated,
    }"
    @click="() => clickRow(true)"
  >
    <TableItem
      v-for="item in fields"
      :key="item"
      :row="props.row"
      :item="item"
      :slug="props.slug"
      :is-trash="isTrash"
      @call-action="(data) => emit('callAction', data)"
    />
  </tr>
</template>

<script setup>
import './Row.scss'

import { inject, ref } from 'vue'
import { clickOutSide as vClickOutSide } from '@mahdikhashan/vue3-click-outside'

import TableItem from '../Item/Item.vue'

const rowRef = ref(null)
const fields = inject('fields')

const props = defineProps({
  isTrash: {
    default: false,
    type: Boolean
  },
  row: {},
  slug: {
    default: '',
    type: String
  }
})

const emit = defineEmits([
  'callAction'
])

// Добавление классов приоритета при клике на строку
const clickRow = (state) => {
  if (state) {
    rowRef.value.classList.add('table_row_clicked')
  } else {
    rowRef.value.classList.remove('table_row_clicked')
  }
}
</script>
