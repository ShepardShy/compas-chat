<template>
  <div class="pagination">
    <div class="pagination__title">
      Страница:
    </div>
    <PaginationListShort
      v-if="props.totalPages <= 7"
      :active-page="props.activePage"
      :total-pages="props.totalPages"
      @call-action="(data) => $emit('callAction', data)"
    />
    <PaginationListLarge
      v-else
      :active-page="props.activePage"
      :total-pages="props.totalPages"
      @call-action="(data) => $emit('callAction', data)"
    />
  </div>
</template>

<script setup>
import './Pagination.scss'

import PaginationListLarge from './PaginationListLarge/PaginationListLarge.vue'
import PaginationListShort from './PaginationListShort/PaginationListShort.vue'

defineEmits(['callAction'])

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
</script>
