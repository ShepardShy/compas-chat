<template>
  <FormItem
    class="form__item_datepicker"
    :required="props.item.required"
  >
    <div class="table__item-content_title">
      {{ props.item.title }}
    </div>
    <VueDatePicker
      ref="datepicker"
      v-model="localItem.value"
      v-mask="'##.##.####'"
      text-input
      locale="ru"
      auto-apply
      position="left"
      hide-offset-dates
      format="dd.MM.yyyy"
      placeholder="__.__.____"
      :enable-time-picker="false"
      :month-change-on-scroll="false"
      :max-time="{ hours: 0, minutes: 0, seconds: 0 }"
      :text-input-options="{format: 'dd.MM.yyyy'}"
      @update:model-value="(e) => updateValue(e)"
    >
      <template #right-sidebar>
        <div class="datapicker__preset-days">
          <div
            v-for="day in presetDates"
            :key="day.day"
            class="datapicker__preset-item"
            :class="setClassSidebar(localItem, day.day)"
            @click="() => setPresetDate(day)"
          >
            {{ day.title }}
          </div>
        </div>
      </template>
    </VueDatePicker>
  </FormItem>
</template>

<script setup>
import './AppDateInput.scss'
import '../AppDate.scss'

import { ref, watch, onMounted } from 'vue'

import VueDatePicker from '@vuepic/vue-datepicker'
import FormItem from '~/components/ui/AppForm/FormItem/FormItem.vue'
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps({
  item: {
    default: {
      id: 0,
      key: '',
      title: '',
      value: '',
      required: false
    },
    type: () => Object
  }
})

const emit = defineEmits([
  'selectDate',
  'changeValue',
  'openDatepicker'
])

// Локальная переменная для взаимодействия с v-model
const localItem = ref({})
const presetDates = ref([
  {
    id: 0,
    title: 'Вчера',
    day: new Date().setDate(new Date().getDate() - 1)
  },
  {
    id: 1,
    title: 'Сегодня',
    day: new Date()
  },
  {
    id: 2,
    title: 'Завтра',
    day: new Date().setDate(new Date().getDate() + 1)
  },
  {
    id: 3,
    title: 'Послезавтра',
    day: new Date().setDate(new Date().getDate() + 2)
  }
])
const datepicker = ref(null)

// Установка даты из пресета по клику
const setPresetDate = (date) => {
  localItem.value.value = date.day
  selectDate(localItem.value)
  datepicker.value.closeMenu()
}

// Установка даты для отправки на сервер
const selectDate = (data) => {
  data.value = transformDate(data.value)
  emit('changeValue', data)
}

// Установка класса для сайдбара
const setClassSidebar = (localItem, day) => {
  if (transformDate(day) == transformDate(localItem.value)) {
    return 'datapicker__preset-item_active'
  } else {
    return ''
  }
}

// Преобразование даты в необходимый формат
const transformDate = (data) => {
  if (data != '') {
    const date = new Date(data)
    return `${date.toLocaleString().split(',')[0].split('.').reverse().join('-')}`
  } else {
    return ''
  }
}

const updateValue = (event) => {
  localItem.value.date = event
  selectDate({ id: props.item.id, key: props.item.type, value: event })
}

const setLocalItem = () => {
  localItem.value = props.item
  localItem.value.key = props.item.key
  localItem.value.value = [null, undefined, 'Invalid Date'].includes(props.item.value) ? '' : props.item.value.split('.').reverse().join('-')
}

watch(() => props.item.value, () => {
  setLocalItem()
})

onMounted(() => {
  setLocalItem()

  if (props.item.focus) {
    datepicker.value.openMenu()
  }
})

watch(() => props.item.focus, () => {
  if (props.item.focus) {
    setTimeout(() => {
      datepicker.value.openMenu()
    }, 10)
  }
})
</script>
