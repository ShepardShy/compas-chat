<template>
    <div class="actions" v-if="actionState != null">
        <ButtonsEdit 
            v-if="actionState == 'editting'"
            @callAction="(data) => emit('callAction', data)"
        />

        <ButtonsSave 
            v-else-if="actionState == 'saving'"
            @callAction="(data) => emit('callAction', data)"
        />

        <ButtonsRestore 
            v-else-if="actionState == 'restoring'"
            @callAction="(data) => emit('callAction', data)"
        />
    </div>
</template>

<script setup>
    import './Actions.scss';
    
    import ButtonsEdit from './Edit/Edit.vue'
    import ButtonsSave from './Save/Save.vue'
    import ButtonsRestore from './Restore/Restore.vue'

    const emit = defineEmits([
        'callAction'
    ])

    const props = defineProps({
        actionState: {
            default: null,
            type: String
        }
    })
</script>
