<template>
    <tr 
        ref="rowRef"
        class="table__row" 
        @click="() => clickRow(true)"
        v-click-out-side="(event) => clickRow(false)" 
        :class="props.row.isEdit ? 'table__row_edit' : props.row.isChoose ? 'table__row_choosed' : '', props.row.isUpdated ? 'table__row_updated' : ''"
    >
        <TableItem 
            v-for="item in fields"
            :row="props.row"
            :item="item"
            :slug="props.slug"
            :isTrash="isTrash"
            @callAction="(data) => emit('callAction', data)"
        />
    </tr>
</template>

<script setup>
    import './Row.scss';
    
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
