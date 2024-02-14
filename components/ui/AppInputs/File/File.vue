<template>
    <FormItem
        class="file form-item__file"
        :required="props.item.required"
    >
        <FormLabel
            v-show="props.item.title != null && props.item.title != ''"
            :title="props.item.title"
        />

        <FileField
            :item="props.item"
            :isReadOnly="props.isReadOnly"
            :isShowFileName="props.isShowFileName"
            :isMultiple="props.isMultiple"
            :isOneFile="props.isOneFile"
            @changeValue="(data) => emit('changeValue', data)"
        />
    </FormItem>
</template>

<script setup>
    import './File.scss';

    import FormItem from "@/components/AppForm/FormItem/FormItem.vue";
    import FormLabel from "@/components/AppForm/FormLabel/FormLabel.vue";
    import FileField from './FileField/FileField.vue'

    const props = defineProps({
        item: {
            default: {
                id: 1517,
                title: "Undefined title",
                type: "file",
                key: "",
                required: false,
                focus: true,
                value: null,
                buttonName: "",
            },
            type: Object
        },
        isReadOnly: {
            default: false,
            type: Boolean
        },
        isShowFileName: {
            default: false,
            type: Boolean
        },
        isMultiple: {
            default: false,
            type: Boolean
        },
        isOneFile: {
            default: false,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'changeValue'
    ])
</script>
