<template>
  <FormItem
    class="form__item_datepicker datepicker_range"
    :required="props.item.required"
  >
    <div class="table__item-content_title">
      {{ props.item.title }}
    </div>
    <VueDatePicker
      ref="datepicker"
      :value="props.item.value"
      range
      multi-calendars
      auto-apply
      locale="ru"
      position="left"
      hide-offset-dates
      format="dd.MM.yyyy"
      placeholder="__.__.____ — __.__.____"
      :enable-time-picker="false"
      :max-time="{ hours: 0, minutes: 0, seconds: 0 }"
      :text-input-options="{format: 'dd.MM.yyyy'}"
      :month-change-on-scroll="false"
      @open="event => hideAllDetails(event)"
      @closed="showMenu = false"
      @update:model-value="(e) => {
        selectDate({id: props.item.id, key: props.item.type, value: e})
        localItem.date = e
      }"
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

      <template #left-sidebar>
        <AppDateRangeFooter
          :item="props.item"
          @select-date="(data) => selectDate(data)"
        />
      </template>
    </VueDatePicker>

    <div
      class="datepicker__mirror"
      :class="showMenu ? 'datepicker__mirror_active' : ''"
    >
      {{ setMirrorValue }}
    </div>
  </FormItem>
</template>

<script setup>
import './AppDateRange.scss'
import '../AppDate.scss'

import VueDatePicker from '@vuepic/vue-datepicker'
import AppDateRangeFooter from './AppDateRangeFooter/AppDateRangeFooter.vue'
import FormItem from '@/components/AppForm/FormItem/FormItem.vue'

import commonScripts from '@/helpers/commonScripts'
import '@vuepic/vue-datepicker/dist/main.css'
import DateScripts from '../DateScripts'

// Локальная переменная для взаимодействия с v-model
const showMenu = ref(false)
const localItem = ref({})
const presetDates = ref([
  {
    id: 1,
    title: 'Сегодня',
    range: 'today',
    day: DateScripts.setTimeRange('today', true)
  },
  {
    id: 2,
    title: 'Завтра',
    range: 'tommorow',
    day: DateScripts.setTimeRange('tommorow', true)
  },
  {
    id: 3,
    title: 'Текущий месяц',
    range: 'currentMonth',
    day: DateScripts.setTimeRange('currentMonth', true)
  },
  {
    id: 4,
    title: 'Прошлый месяц',
    range: 'prevMonth',
    day: DateScripts.setTimeRange('prevMonth', true)
  },
  {
    id: 5,
    title: 'Текущий год',
    range: 'currentYear',
    day: DateScripts.setTimeRange('currentYear', true)
  },
  {
    id: 6,
    title: 'Прошлый год',
    range: 'prevYear',
    day: DateScripts.setTimeRange('prevYear', true)
  }
])

const datepicker = ref(null)

const hideAllDetails = (event) => {
  emit('openDatepicker', true)
  showMenu.value = true
  commonScripts.hideAllDetails('details', event)
  const menu = document.querySelector('.dp__menu')
  const datepickerField = menu.closest('.form__item')
  const rect = menu.getBoundingClientRect()
  const eventHeight = rect.y + rect.height + datepickerField.offsetHeight + 5

  if (eventHeight > window.innerHeight) {
    menu.classList.add('dp__menu_up')
  } else {
    const node = document.querySelectorAll('.dp__menu_up')
    for (const elem of node) {
      elem.classList.remove('select__options_up')
    }
  }
}

// Установка даты из пресета по клику
const setPresetDate = (date) => {
  localItem.value.value = date.day
  selectDate(localItem.value)
  datepicker.value.closeMenu()
}

// Установка даты для отправки на сервер
const selectDate = (data) => {
  emit('changeValue', data)
  datepicker.value.closeMenu()
}

// Установка класса для сайдбара
const setClassSidebar = (localItem, day) => {
  if (transformDate(localItem.value[0]) == transformDate(day[0]) && transformDate(day[1]) == transformDate(localItem.value[1])) {
    return 'datapicker__preset-item_active'
  } else {
    return ''
  }
}

// Преобразование даты в необходимый формат
const transformDate = (data) => {
  return new Date(data).getTime() / 1000
}

// Преобразование даты в необходимый формат
const transformHumanDate = (data) => {
  const date = new Date(data)
  return `${date.toLocaleString().split(',')[0]}`
}

const setMirrorValue = computed(() => {
  if (props.item.value == '' || props.item.value.length == 0 || props.item.value == null) {
    return '__.__.____ — __.__.____'
  } else {
    const startDate = transformHumanDate(props.item.value[0])
    const endDate = transformHumanDate(props.item.value[1])
    if (startDate == endDate) {
      return startDate
    } else {
      return `${startDate} — ${endDate}`
    }
  }
})

const props = defineProps({
  item: {
    default: {
      id: 0,
      value: '',
      type: 'date',
      key: '',
      placeholder: '',
      typeComponent: 'input',
      title: 'Undefined title'
    },
    type: () => Object
  }
})

const emit = defineEmits([
  'openDatepicker',
  'changeValue'
])

onMounted(() => {
  localItem.value = props.item
  localItem.value.key = props.item.key
  localItem.value.value = props.item.value
})
</script>
