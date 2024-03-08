<template>
    <FormItem
        class="address form-item__address"
        :required="props.item.required"
    >
        <FormLabel
            v-show="props.item.title != null && props.item.title != ''"
            :title="props.item.title"
        />

        <Field
            :item="props.item"
            :isReadOnly="props.isReadOnly"
            :isShowMap="props.isShowMap"
            :isSelectSeveral="props.isSelectSeveral"
            @changeValue="(data) => emit('changeValue', (data))"
            @searchOptions="(data) => emit('searchOptions', (data))"
            @selectPoints="(data) => emit('selectPoints', (data))"
        />

    </FormItem>
</template>

<script setup>
    import './Address.scss';

    import FormLabel from "@/components/AppForm/FormLabel/FormLabel.vue";
    import FormItem from "@/components/AppForm/FormItem/FormItem.vue";
    import Field from "@/components/AppInputs/Address/Field/Field.vue";

    const props = defineProps({
        item: {
            default: {
                id: 0,
                title: "Адрес",
                key: "address",
                required: false,
                value: {
                    text: "",
                    coords: [
                        "55.642606",
                        "37.547414"
                    ]
                }
            },
            type: Object
        },
        isReadOnly: {
            default: false,
            type: Boolean
        },
        isShowMap: {
            default: false,
            type: Boolean
        },
        isSelectSeveral: {
            default: false,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'changeValue',
        'searchOptions',
        'selectPoints'
    ])
</script>