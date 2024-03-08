<template>
    <div class="address__wrapper">
        <AppAutocomplete
            :item="props.item"
            :isCanCreate="false"
            :isLink="false"
            :isShowId="false"
            :isReadOnly="props.isReadOnly"
            @changeValue="(data) => changeValue(data)"
            @searchOptions="(data) => emit('searchOptions', (data))"
        />

        <AppCopy
            v-if="activeOption"
            :text="activeOption.text"
            :buttonTitle="'Скопировать адрес'"
        />

        <Map
           v-if="props.isShowMap"
           :markers="activeOption ? [activeOption] : []"
           :isSelectSeveral="props.isSelectSeveral"
           :isReadOnly="props.isReadOnly"
           @selectPoints="(data) => emit('selectPoints', (data))"
        />
    </div>
</template>

<script setup>
    import './Field.scss';

    import { ref, watch} from "vue";

    import AppAutocomplete from "@/components/Appautocomplete/input.vue";
    import Map from "@/components/AppInputs/Address/Map/Map.vue";
    import AppCopy from "@/components/AppCopy/AppCopy.vue";
    import _ from "lodash";

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

    const activeOption = ref(null)

    const changeValue = (data) => {
        const selectedItem = props.item.options.find((option) => data && _.isEqual(option.value, data.value))
        emit('changeValue', {
            key: props.item.key,
            value: selectedItem ? selectedItem.value : null
        })
    }

    const setActiveOption = () => {
        if (props.item.value && !props.item.options.find((option) => _.isEqual(option.value, props.item.value))) {
            props.item.options.push({
                label: {
                    text: props.item.value.text
                },
                value: props.item.value
            })
        }

        const selectedItem = props.item.options.find((option) => props.item.value && _.isEqual(option.value, props.item.value))
        activeOption.value = selectedItem ? selectedItem.value : null
    }

    setActiveOption()

    watch(() => props.item.value, () => {
        setActiveOption()
    })

</script>