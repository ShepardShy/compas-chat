<template>
  <th
    ref="tableItemRef"
    class="table__item table-item"
  >
    <div
      v-if="props.item.key == 'isChoose'"
      class="table-item__content"
    >
      <AppCheckbox
        :item="{
          id: props.item.id,
          key: props.item.key,
          type: props.item.type,
          value: selectAll,
          title: props.item.title,
          substring: props.item.unit,
          is_link: props.item.is_link,
          is_plural: props.item.is_plural,
          hiddenOptions: props.item.choosed,
          related_table: props.item.related_table,
          is_external_link: props.item.is_external_link,
          options: null,
          external_link: null,
        }"
        :is-can-create="false"
        :is-use-enter="false"
        :enabled-autocomplete="false"
        :is-read-only="false"
        @change-value="(data) => selectAllRows(data)"
      />

      <div
        class="table-item__drag-area"
        :draggable="true"
        @dragover.prevent
        @dragenter.prevent
        @dragstart="(event) => $emit('dragStart', event)"
        @dragend="(event) => $emit('dragEnd', event)"
      />
      <div class="table-item__border" />
    </div>

    <div
      v-else
      class="table-item__content"
      @click="() => doubleClick()"
    >
      <span class="table-item__title">
        {{ props.item.title }}
      </span>
      <IconSort
        v-if="sortItem.key == props.item.key"
        :class="sortItem.order == 'asc' ? 'icon__sort_up' : ''"
      />

      <div
        class="table-item__drag-area"
        :draggable="!props.headerRef.parentNode.classList.contains('table_resizing')"
        @dragover.prevent
        @dragenter.prevent
        @dragstart="(event) => $emit('dragStart', event)"
        @dragend="(event) => $emit('dragEnd', event)"
      />

      <div class="table-item__border" />
    </div>
  </th>
</template>

<script setup>
import './Item.scss'

import { ref, inject } from 'vue'
import AppCheckbox from '@/components/AppInputs/Checkbox/Checkbox.vue'
import IconSort from '@/components/AppIcons/Sort/Sort.vue'

const tableItemRef = ref(null)
const menu = inject('menu')
const sortItem = inject('sortItem')
const bodyData = inject('bodyData')
const selectAll = inject('selectAll')
const footerData = inject('footerData')
const actionState = inject('actionState')

const clickSetting = ref({
  id: -1,
  delay: 500,
  clicks: 0,
  timer: null
})

defineEmits(['dragStart', 'dragEnd'])

const props = defineProps({
  item: {
    default: {
      id: 0,
      index: 0,
      key: 'key',
      title: null,
      type: 'text',
      width: '0px',
      fixed: false,
      enabled: true,
      sort_order: null
    },
    type: () => Object
  },
  headerRef: {
    default: null
  },
  isTrash: {
    default: false,
    type: Boolean
  }
})

// Симуляция двойного клика
const doubleClick = () => {
  clickSetting.value.clicks++
  if (clickSetting.value.clicks === 1) {
    clickSetting.value.timer = setTimeout(() => {
      clickSetting.value.clicks = 0
    }, clickSetting.value.delay)
  } else {
    if ((props.item.key != 'isChoose') && (props.item.key != 'actions')) {
      sortItem.value = {
        key: props.item.key,
        order: sortItem.value.key == props.item.key ? (sortItem.value.order == 'desc' ? 'asc' : 'desc') : 'desc'
      }
      menu.value.saves.isShow = true
      footerData.value.activePage = 1

      emit('callAction', {
        action: 'getTableData',
        value: null
      })
    }
    window.getSelection().empty()
    clearTimeout(clickSetting.value.timer)
    clickSetting.value.clicks = 0
  }
  clickSetting.value.id = props.item.id
}

// Выбор всех строк
const selectAllRows = (data) => {
  selectAll.value = data.value
  bodyData.value.forEach((row) => {
    row.isChoose = selectAll.value
  })

  if (data.value) {
    actionState.value = props.isTrash ? 'restoring' : 'editting'
  } else {
    actionState.value = null
  }
}
</script>
