<template>
  <thead
    ref="headerRef"
    class="table__header"
  >
    <tr class="table__row">
      <HeaderItem
        v-for="(item) in fields"
        :key="item.key"
        :item="item"
        :header-ref="headerRef"
        :data-key="item.key"
        :is-trash="props.isTrash"
        :class="[
          item.fixed ? 'table__item_fixed' : '',
          !item.enabled ? 'table__item_hidden' : '',
          item.required ? 'table__item_required' : '',
          item.read_only ? 'table__item_readonly' : '',
          item.isUpdated ? 'table__item_updated' : ''
        ]"
        @drag-start="(event) => dragColumn({action: 'dragStart', value: {event, key: item.key}})"
        @drag-end="() => dragColumn({action: 'dragEnd', value: null})"
      />
    </tr>
  </thead>
</template>

<script setup>
import './Header.scss'

import { ref, inject, onMounted, onUnmounted, watch } from 'vue'

import _ from 'lodash'
import HeaderItem from './Item/Item.vue'
import resizeTable from './resizeTable.js'

const headerRef = ref(null)

const menu = inject('menu')
const fields = inject('fields')
const tableRef = inject('tableRef')

const draggingItem = ref(null)
const tableCopy = ref(null)
const prevMouseCoords = ref(null)
const mouseDown = ref(null)

const props = defineProps({
  isTrash: {
    default: false,
    type: Boolean
  }
})

// Движение мыши
const onMouseMove = (e) => {
  // Перетаскивание колонки
  const moveColumn = (posX) => {
    const itemListParent = tableCopy.value.querySelector('thead tr')
    const itemList = itemListParent.querySelectorAll('.table__item')

    const tableBodyListParent = [...tableCopy.value.querySelectorAll('tbody tr')]
    const fromIndex = [...itemList].findIndex(p => p.getAttribute('data-key') == draggingItem.value)

    let stopDrag = false

    const hoverElementIndex = [...itemList].findIndex((elem, index) => {
      const itemCoords = elem.getBoundingClientRect()
      const startCoord = itemCoords.x
      const center = (itemCoords.x + (itemCoords.x + itemCoords.width)) / 2
      const endCoord = itemCoords.x + itemCoords.width
      const coord = (startCoord + center) / 2

      if ((posX >= coord && posX <= endCoord) && ((posX > center + 3 && fromIndex > index) || (posX < center - 3 && fromIndex < index))) {
        stopDrag = true
      }

      return posX >= coord && posX <= endCoord
    })

    if (stopDrag || [null, undefined, -1].includes(hoverElementIndex) || itemList[hoverElementIndex].classList.contains('table__item_sticky')) return

    if (fromIndex > hoverElementIndex) {
      itemListParent.insertBefore(itemList[fromIndex], itemList[hoverElementIndex])

      for (const row of tableBodyListParent) {
        row.insertBefore(row.children[fromIndex], row.children[hoverElementIndex])
      }
    } else if (fromIndex < hoverElementIndex) {
      itemListParent.insertBefore(itemList[hoverElementIndex], itemList[fromIndex])

      for (const row of tableBodyListParent) {
        row.insertBefore(row.children[hoverElementIndex], row.children[fromIndex])
      }
    }
  }

  e = e || window.event
  const dragX = e.pageX
  if (prevMouseCoords.value != dragX) {
    moveColumn(dragX)
  }
  prevMouseCoords.value = dragX
}

// Перемещение колонки
const dragColumn = (data) => {
  // Копирование таблицы
  const copyTable = () => {
    tableCopy.value = tableRef.value.cloneNode(true)
    tableCopy.value.classList.add('table_copy')

    const tableCells = tableCopy.value.querySelectorAll('.table__item')
    const tableRows = tableCopy.value.querySelectorAll('.table__row')

    tableRows.forEach((row, index) => {
      if (index >= 30) {
        row.remove()
      }
    })

    for (const cell of tableCells) {
      if (cell.getAttribute('data-key') == draggingItem.value) {
        cell.classList.add('sortable-ghost')
      }
    }

    setTimeout(() => {
      tableRef.value.closest('.table-template__body').appendChild(tableCopy.value)
      tableRef.value.closest('.section__table').style.setProperty('overflow', 'hidden')

      tableRef.value.classList.add('table_hidden')
    }, 100)
  }

  // Обновление положения полей
  const updateFields = () => {
    const list = tableCopy.value.querySelectorAll('thead .table__item')
    let findedField = null
    const data = []
    list.forEach((element, index) => {
      findedField = fields.value.find(p => p.key == element.getAttribute('data-key'))
      findedField.index = index
      data.push(findedField)
    })

    fields.value = data.sort((next, prev) => next.index - prev.index)
  }

  // Начало перетаскивания
  const dragStart = (value) => {
    draggingItem.value = value.key

    copyTable()
    setDragImage(value.event)
    document.addEventListener('dragover', onMouseMove)
  }

  // Конец перетаскивания
  const dragEnd = () => {
    // Удаление таблицы из дататрансфера
    const removeDragImage = () => {
      const removingItem = document.getElementById('table_transfer')
      if (removingItem != null) {
        removingItem.remove()
      }
    }

    draggingItem.value = null
    removeDragImage()
    updateFields()
    tableRef.value.classList.remove('table_hidden')
    tableCopy.value.remove()
    document.removeEventListener('dragover', onMouseMove)
    menu.value.saves.isShow = true
    tableRef.value.closest('.section__table').style.removeProperty('overflow')

    setTimeout(() => {
      const cells = headerRef.value.querySelector('tr').children
      resizeTable.setDefaultWidth(cells, fields.value)
    }, 10)
  }

  // Создание колонки для дататрансфера
  const setDragImage = (event) => {
    if (document.getElementById('table_transfer') == null) {
      const table = tableCopy.value.cloneNode(true)
      const backupRows = tableRef.value.querySelectorAll('.table__row')
      table.id = 'table_transfer'
      table.classList.add('table_transfer')
      table.classList.add('table')
      table.style.width = `${tableCopy.value.offsetWidth}px`
      document.body.appendChild(table)

      const rows = table.querySelectorAll('.table__row')

      rows.forEach((row, index) => {
        const items = row.querySelectorAll('.table__item')
        for (const item of items) {
          if (item.getAttribute('data-key') != draggingItem.value) {
            item.remove()
          } else {
            const findedRow = [...backupRows][index]
            if (findedRow != undefined) {
              if (item.offsetWidth >= 300) {
                item.style.setProperty('--defaultWidth', '300px')
              }
              item.style.height = `${findedRow.offsetHeight}px`
              item.classList.remove('sortable-ghost')
            } else {
              item.style.height = `${row.offsetHeight}px`
            }
          }
        }
      })

      event.dataTransfer.setDragImage(table, event.offsetX, event.OffsetY)
    }
  }

  switch (data.action) {
    // Копирование таблицы
    case 'copyTable':
      copyTable()
      break

      // Обновление положения полей
    case 'updateFields':
      updateFields()
      break

      // Начало перетаскивания
    case 'dragStart':
      dragStart(data.value)
      break

      // Конец перетаскивания
    case 'dragEnd':
      dragEnd()
      break
    default:
      break
  }
}

// Отображение сохранения после ресайза колонки
const updateTableHeader = (e) => {
  if (tableRef.value.classList.contains('table_resizing')) {
    menu.value.saves.isShow = true
    const findedIndex = fields.value.findIndex(p => p.key == mouseDown.value.closest('.table__item').getAttribute('data-key'))
    fields.value[findedIndex].width = `${mouseDown.value.closest('.table__item').offsetWidth}px`
  }
}

const scrollTable = _.throttle(async function () {
  resizeTable.setStickyClass(tableRef.value)
}, 10)

onMounted(() => {
  setTimeout(() => {
    resizeTable.resizableGrid(tableRef.value, fields.value)
    tableRef.value.parentNode.addEventListener('scroll', scrollTable)
    document.addEventListener('mouseup', updateTableHeader)
    document.addEventListener('mousedown', (e) => {
      mouseDown.value = e.target
    })
  }, 100)
})

watch(() => fields.value, () => {
  if (fields.value.length > 0) {
    setTimeout(async () => {
      await resizeTable.setCellsWidth(tableRef.value)
    }, 10)
    setTimeout(() => {
      resizeTable.setStickyClass(tableRef.value)
    }, 100)
  }
}, { deep: true })

onUnmounted(() => {
  document.removeEventListener('dragover', onMouseMove)
  document.removeEventListener('mouseup', updateTableHeader)
  document.removeEventListener('mousedown', (e) => {
    mouseDown.value = e.target
  })
})
</script>
