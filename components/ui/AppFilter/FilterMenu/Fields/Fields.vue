<template>
  <draggable
    v-if="activeFields.length > 0"
    v-model="activeFields"
    class="filter__fields"
    group="filter-fields"
    item-key="filter-fields"
    handle=".icon__draggable"
    @end="(event) => dragEnd(event)"
  >
    <template #item="{ element: field }">
      <div class="filter__field">
        <IconDrag />
        <component
          :is="field.component"
          :item="field"
          :enabled-autocomplete="false"
          @change-value="(data) => changeValue(data)"
        />

        <AppPopup :close-by-click="true">
          <template #summary>
            <IconSettings />
          </template>
          <template #content>
            <PopupOption @click="() => actionFilter(field)">
              Скрыть
            </PopupOption>
          </template>
        </AppPopup>
      </div>
    </template>
  </draggable>

  <div
    v-else
    class="filter__fields filter__fields_empty"
  >
    Нет активных полей
  </div>
</template>

<script setup>
import './Fields.scss'

import { inject } from 'vue'
import draggable from 'vuedraggable'

import AppPopup from '@/components/AppPopup/Popup.vue'
import IconDrag from '@/components/AppIcons/Drag/Drag.vue'
import IconSettings from '@/components/AppIcons/Settings/Settings.vue'
import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue'

const activeFields = inject('activeFields')

const emit = defineEmits([
  'actionFilter'
])

// Изменение значения в поле
const changeValue = (data) => {
  const field = activeFields.value.find(field => field.key === data.key)
  field.value = data.value
}

// Скрытие поля
const actionFilter = (field) => {
  emit('actionFilter', {
    action: 'enabledField',
    value: {
      value: !field.enabled,
      key: field.key
    }
  })
}

// Изменение порядка полей
const dragEnd = (event) => {
  const data = []

  event.to.__draggable_component__.modelValue.forEach((element, index) => {
    data.push({
      sort: index,
      value: null,
      key: element.key
    })
  })

  emit('actionFilter', { action: 'changeOrder', value: { fields: event.to.__draggable_component__.modelValue, requestFields: data } })
}
</script>
