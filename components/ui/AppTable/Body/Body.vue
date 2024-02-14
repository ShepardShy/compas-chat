<template>
    <tbody class="table__body">
        <TableRow 
            v-for="row in bodyData" 
            :row="row"
            :slug="props.slug"
            @callAction="(data) => emit('callAction', data)"
        />
    </tbody>
</template>

<script setup>
    import './Body.scss';
    
    import { inject } from 'vue'

    import TableRow from './Row/Row.vue'

    const bodyData = inject('bodyData')

    const props = defineProps({
        isTrash: {
            default: false,
            type: Boolean
        },
        slug: {
            default: '',
            type: String
        }
    })

    const emit = defineEmits([
        'callAction'
    ])
</script>
