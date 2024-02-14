<template>
  <div
    ref="filterRef"
    class="filter"
  >
    <FilterHeader
      :tabs="tabs"
      @action-filter="(data) => actionFilter(data)"
      @change-search="(data) => changeSearch(data)"
    />

    <FilterMenu
      v-show="showMenu"
      @action-filter="(data) => actionFilter(data)"
      @action-saves="(data) => actionSaves(data)"
    />
  </div>
</template>

<script setup>
import './Filter.scss'

import { ref, onMounted, watch, provide, onUnmounted } from 'vue'

import FilterMenu from './FilterMenu/FilterMenu.vue'
import FilterHeader from './FilterHeader/FilterHeader.vue'
import renderScripts from '@/scripts/renderScripts/renderScripts'

const tabs = ref([])
const saves = ref([])
const fields = ref([])
const search = ref('')
const showMenu = ref(false)
const activeFields = ref([])
const backupFields = ref([])
const filterRef = ref(null)

const props = defineProps({
  fields: {
    default: [],
    type: () => Array
  },
  saves: {
    default: [],
    type: () => Array
  },
  tabs: {
    default: null,
    type: Object
  }
})

const emit = defineEmits([
  'actionFilter'
])

onMounted(async () => {
  saves.value = JSON.parse(JSON.stringify(props.saves))
  saves.value.sort((prev, next) => prev.sort - next.sort)
  fields.value = await renderScripts('filter', JSON.parse(JSON.stringify(props.fields)))
  document.addEventListener('mousedown', event => toggleMenu(event))

  if (saves.value.find(item => item.is_hidden) == undefined) {
    saves.value.push({
      id: -1,
      title: 'Фильтр',
      is_hidden: 1,
      sort: 0,
      fields: []
    })
  }

  const hiddenFilter = saves.value.find(item => item.is_hidden)

  for (const field of hiddenFilter.fields) {
    const findedField = fields.value.find(item => item.key == field.key)
    findedField.enabled = true
    findedField.value = null
  }

  setTabsFields()
  activeFields.value = fields.value.filter(field => field.enabled)
})

// Установка активных плашек фильтра
const setTabsFields = () => {
  if (props.tabs != null) {
    for (const field in props.tabs) {
      const findedField = fields.value.find(item => item.key == field)
      if (findedField != undefined) {
        findedField.enabled = true
        findedField.value = props.tabs[field]
      }
    }

    if (props.tabs.q != undefined) {
      search.value = props.tabs.q
    }
  }
  activeFields.value = fields.value.filter(field => field.enabled)
  actionFilter({ action: 'loadTabs', value: null })
}

// Включение и отключение меню
const toggleMenu = (event = null) => {
  if (event != null && event.target.closest('.filter') != null) {
    showMenu.value = true
  } else {
    showMenu.value = false
  }
}

// Изменение поиска
const changeSearch = (data) => {
  search.value = data.value
}

// Действия с фильтром
const actionFilter = (data) => {
  // Поиск по фильтру
  const searchFilter = () => {
    // Установка превью для отображения
    const setPreview = (field) => {
      if (field.type == 'date') {
        return field.value.split('-').reverse().join('.')
      } else if (field.type == 'select_dropdown') {
        return field.options.find(option => option.value == field.value).label
      } else if (field.type == 'relation') {
        return field.options.find(option => option.value == field.value).label
      } else if (field.type == 'status') {
        const label = field.options.find(option => option.value == field.value).label
        return [null, undefined].includes(label.value) || label.value == '' ? label.color : label.value
      } else {
        return field.value
      }
    }

    tabs.value = []

    if (![null, undefined].includes(search.value) && search.value != '') {
      tabs.value.push({
        key: null,
        title: 'Поиск',
        value: search.value,
        preview: search.value
      })
    }

    for (const field of activeFields.value) {
      if (![null, undefined].includes(field.value) && field.value != '') {
        tabs.value.push({
          key: field.key,
          title: field.title,
          value: field.value,
          preview: setPreview(field)
        })
      }
    }
  }

  // Сброс фильтра
  const clearFilter = () => {
    tabs.value = []
    search.value = null
    for (const field of activeFields.value) {
      field.value = null
    }
  }

  // Удаление скрытых плашек в фильтре
  const removeHiddenFilters = (tabs) => {
    for (const tab of tabs) {
      removeFilter(tab)
    }
  }

  // Удаление плашки в фильтре
  const removeFilter = (tab) => {
    tabs.value = tabs.value.filter(field => field.key != tab.key)

    if (tab.key == null) {
      search.value = null
    } else {
      const field = activeFields.value.find(item => item.key == tab.key)
      if (field != undefined) {
        field.value = null
      }
    }
  }

  // Получение объекта для отправки запроса
  const getRequest = () => {
    const request = {}

    for (const tab of tabs.value) {
      request[tab.key == null ? 'q' : tab.key] = tab.value
    }

    emit('actionFilter', { action: 'search', value: request })
  }

  // Перетаскивание полей в фильтре
  const changeOrder = () => {
    const findedFilter = saves.value.find(filter => filter.is_hidden)
    activeFields.value = data.value.fields
    findedFilter.fields = data.value.requestFields
    emit('actionFilter', { action: 'update', value: findedFilter })
  }

  // Скрытие или показ полей
  const changeEnabledField = (data) => {
    const field = fields.value.find(field => field.key === data.key)
    const hiddenFilter = saves.value.find(filter => filter.is_hidden)
    const changedFields = []

    field.enabled = data.value
    field.value = null

    activeFields.value = fields.value.filter(field => field.enabled)

    activeFields.value.forEach((elem, index) => {
      changedFields.push({
        key: elem.key,
        sort: index,
        value: null
      })
    })

    hiddenFilter.fields = changedFields

    emit('actionFilter', { action: 'update', value: hiddenFilter })
  }

  switch (data.action) {
    // Поиск по фильтру
    case 'search':
      searchFilter()
      toggleMenu(null)
      getRequest()
      break

      // Сброс фильтра
    case 'clear':
      clearFilter()
      getRequest()
      break

      // Удаление плашки в фильтре
    case 'removeFilter':
      removeFilter(data.value)
      getRequest()
      break

      // Удаление скрытых плашек в фильтре
    case 'removeHiddenFilters':
      removeHiddenFilters(data.value)
      getRequest()
      break

      // Перетаскивание полей в фильтре
    case 'changeOrder':
      changeOrder()
      break

      // Скрытие или показ полей
    case 'enabledField':
      changeEnabledField(data.value)
      break

    case 'loadTabs':
      searchFilter()
      break

    default:
      break
  }
}

// Действия с сохраненными фильтрами
const actionSaves = (data) => {
  let findedFilter = null
  let findedFitlerIndex = null
  if (data.value != null) {
    findedFilter = saves.value.find(item => item.id == data.value.id)
    findedFitlerIndex = saves.value.findIndex(item => item.id == data.value.id)
  }

  // Смена активного фильтра
  const changeActiveFilter = (status) => {
    let findedField = null
    let newFields = false
    const hiddenFilter = saves.value.find(filter => filter.is_hidden)

    for (const field of activeFields.value) {
      field.value = null
    }

    for (const field of findedFilter.fields) {
      findedField = activeFields.value.find(item => item.key == field.key)

      if (findedField == undefined) {
        if (![null, undefined].includes(field.value) && field.value != '') {
          findedField = fields.value.find(item => item.key == field.key)
          findedField.enabled = true
          findedField.value = field.value
          activeFields.value = fields.value.filter(field => field.enabled)
          newFields = true
        }
      } else {
        findedField.value = field.value
      }
    }

    if (status) {
      actionFilter({ action: 'search', value: null })
    }

    if (newFields) {
      const changedFields = []

      activeFields.value.forEach((elem, index) => {
        changedFields.push({
          key: elem.key,
          sort: index,
          value: null
        })
      })

      hiddenFilter.fields = changedFields
      emit('actionFilter', { action: 'update', value: hiddenFilter })
    }
  }

  // Удаление фильтра
  const deleteFilter = () => {
    saves.value = saves.value.filter(item => item.id != findedFilter.id)
    emit('actionFilter', { action: 'delete', value: findedFilter.id })
  }

  // Редактирование фильтра
  const editFilter = () => {
    changeActiveFilter(false)
    backupFields.value = JSON.parse(JSON.stringify(findedFilter.fields))
    findedFilter.edit = true
  }

  // Отмена редактирования фильтра
  const cancelFilter = () => {
    if (findedFilter.is_new) {
      saves.value = saves.value.filter(item => item.id != findedFilter.id)
    } else {
      findedFilter.fields = backupFields.value
      clearActionsFilter()
    }
  }

  // Сохранение фильтра
  const saveFilter = () => {
    const changedFields = []
    let localFields = null

    if (findedFilter.is_hidden) {
      localFields = activeFields.value
    } else {
      localFields = activeFields.value.filter(field => ![undefined, null].includes(field.value) && field.value != '')
    }

    for (const field of localFields) {
      changedFields.push({
        key: field.key,
        sort: field.sort,
        value: field.value
      })
    }

    findedFilter.fields = changedFields
    clearActionsFilter()

    if (findedFilter.is_new) {
      emit('actionFilter', { action: 'create', value: findedFilter })
      delete findedFilter.is_new
    } else {
      emit('actionFilter', { action: 'update', value: findedFilter })
    }
  }

  // Перемещение фильтра
  const moveFilter = (position) => {
    const ids = []
    let activeSort = 0
    activeSort = findedFilter.sort

    if (position == 'up') {
      findedFilter.sort = saves.value[findedFitlerIndex - 1].sort
      saves.value[findedFitlerIndex - 1].sort = activeSort
    } else {
      findedFilter.sort = saves.value[findedFitlerIndex + 1].sort
      saves.value[findedFitlerIndex + 1].sort = activeSort
    }

    saves.value = saves.value.sort((prev, next) => prev.sort - next.sort)

    for (const save of saves.value.filter(p => !p.is_hidden)) {
      ids.push(save.id)
    }

    emit('actionFilter', { action: 'sort', value: ids })
  }

  // снятие редактирования фильтра
  const clearActionsFilter = () => {
    delete findedFilter.edit
    backupFields.value = null
  }

  // Инициализация создания фильтра
  const initCreateFilter = () => {
    const hiddenFilter = saves.value.find(item => item.is_hidden)
    const newFilter = JSON.parse(JSON.stringify(hiddenFilter))
    newFilter.id = saves.value.length
    newFilter.is_hidden = 0
    newFilter.title = null
    newFilter.is_new = true
    newFilter.edit = true
    newFilter.sort = saves.value[saves.value.length - 1].id + 1
    saves.value.push(newFilter)
  }

  switch (data.action) {
    // Перемещение фильтра вверх
    case 'up':
      moveFilter('up')
      break

      // Перемещение фильтра вниз
    case 'down':
      moveFilter('down')
      break

      // Редактирование фильтра
    case 'edit':
      editFilter()
      break

      // Удаление фильтра
    case 'delete':
      deleteFilter()
      break

      // Сохранение фильтра
    case 'save':
      saveFilter()
      break

      // Отмена редактирования
    case 'cancel':
      cancelFilter()
      break

      // Смена активного фильтра
    case 'changeActiveFilter':
      changeActiveFilter(true)
      break

      // Инициализация создания фильтра
    case 'initCreate':
      initCreateFilter()
      break

    default:
      break
  }
}

provide('saves', saves)
provide('search', search)
provide('fields', fields)
provide('activeFields', activeFields)

onUnmounted(() => {
  saves.value = []
  fields.value = []
  document.removeEventListener('mousedown', event => toggleMenu(event))
})

watch(() => props.tabs, () => {
  setTabsFields()
})
</script>
