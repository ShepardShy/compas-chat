<template>
    <FormItem class="form-item__checkbox" :class="props.disabled ? 'form-item__checkbox_disabled' : ''" @click="() => changeValue()">
        <CheckboxLabel 
            :title="props.item.title"
            :isHTML="props.item.isHTML"
        />
        <CheckboxField 
            :item="{
                id: props.item.id,
                value: props.item.value
            }"
            :disabled="props.disabled"
        />
    </FormItem>
</template>

<script setup>
    import './Checkbox.scss';
    import FormItem from '@/components/AppForm/FormItem/FormItem.vue';

    import CheckboxLabel from './CheckboxLabel/CheckboxLabel.vue';
    import CheckboxField from './CheckboxField/CheckboxField.vue';

    const props = defineProps({
        item: {
            default: {
                id: 0,
                key: '',
                title: '',
                value: false,
                isHTML: false
            },
            type: Object
        },
        disabled: {
            default: false,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'changeValue'
    ])

    const changeValue = () => {
        if (!props.disabled) {
            emit('changeValue', {
                id: props.item.id, 
                key: props.item.key, 
                value: !props.item.value
            })
        }
    }
</script>
