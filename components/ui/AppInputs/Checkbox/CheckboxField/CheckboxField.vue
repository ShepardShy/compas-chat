<template>
    <input
        autocomplete="off"
        type="checkbox"
        :value="props.item.value"
        :checked="props.item.value"
        :disabled="props.disabled"
        :id="`checkbox_${props.item.id}`"
    />

    <label :for="`checkbox_${props.item.id}`">
        <IconCheckbox />
    </label>
</template>

<script setup>
    import './CheckboxField.scss';

    import IconCheckbox from './IconCheckbox.vue'
    
    const props = defineProps({
        item: {
            default: {
                id: 0,
                value: false
            },
            type: Object
        },
        disabled: {
            default: false,
            type: Boolean
        }
    })
</script>
