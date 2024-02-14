<template>
  <PaginationList
    v-if="props.activePage < 5"
    class="pagination__list_grid"
    :style="`--grid-columns-short: 7`"
  >
    <PaginationItem
      v-for="item in 5"
      :key="item"
      :item="item"
      :active-page="props.activePage"
      :class="item == props.activePage ? 'pagination__item_active' : ''"
      @call-action="(data) => emit('callAction', data)"
    />
    <PaginationItem
      class="pagination__item_disabled"
      :item="'...'"
      :active-page="props.activePage"
    />
    <PaginationItem
      :item="props.totalPages"
      :active-page="props.activePage"
      @call-action="(data) => emit('callAction', data)"
    />
  </PaginationList>

  <PaginationList
    v-else-if="props.activePage >= 5 && props.activePage <= props.totalPages - 4"
    class="pagination__list_grid"
    :style="`--grid-columns-short: 7`"
  >
    <PaginationItem
      :item="1"
      :active-page="props.activePage"
      @call-action="(data) => emit('callAction', data)"
    />
    <PaginationItem
      class="pagination__item_disabled"
      :item="'...'"
      :active-page="props.activePage"
    />
    <PaginationItem
      v-for="item in 3"
      :key="item"
      :item="props.activePage - 2 + item"
      :active-page="props.activePage"
      :class="props.activePage - 2 + item == props.activePage ? 'pagination__item_active' : ''"
      @call-action="(data) => emit('callAction', data)"
    />
    <PaginationItem
      class="pagination__item_disabled"
      :item="'...'"
      :active-page="props.activePage"
    />
    <PaginationItem
      :item="props.totalPages"
      :active-page="props.activePage"
      @call-action="(data) => emit('callAction', data)"
    />
  </PaginationList>

  <PaginationList
    v-else
    class="pagination__list_grid"
    :style="`--grid-columns-short: 7`"
  >
    <PaginationItem
      :item="1"
      :active-page="props.activePage"
      @call-action="(data) => emit('callAction', data)"
    />
    <PaginationItem
      class="pagination__item_disabled"
      :item="'...'"
      :active-page="props.activePage"
    />
    <PaginationItem
      v-for="item in 5"
      :key="item"
      :item="endItems(item)"
      :active-page="props.activePage"
      :class="endItems(item) == props.activePage ? 'pagination__item_active' : ''"
      @call-action="(data) => emit('callAction', data)"
    />
  </PaginationList>
</template>

<script setup>
import './PaginationListLarge.scss'

import PaginationList from '../PaginationList/PaginationList.vue'
import PaginationItem from '../PaginationItem/PaginationItem.vue'

const props = defineProps({
  activePage: {
    default: 1,
    type: Number
  },
  totalPages: {
    default: 1,
    type: Number
  }
})

const emit = defineEmits([
  'callAction'
])

// Определение последнего элемента
const endItems = (item) => {
  const Arr = []
  for (let i = 0; i < 5; i++) {
    Arr.push(props.totalPages - i)
  }
  return Arr.reverse()[item - 1]
}
</script>
