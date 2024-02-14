<template>
    <AppAutocomplete 
        v-if="localItem != null"
        class="relation__item"
        :item="localItem" 
        :isReadOnly="props.isReadOnly"
        :isCanCreate="props.isCanCreate" 
        :isShowId="true"
        :isLink="![null, undefined].includes(activeOption.id)"
        :class="[null, undefined].includes(activeOption.id) ? 'relation__item_empty' : ''"
        @clickOutside="() => emit('clickOutside', true)"
        @createOption="(data) => emit('createOption', data)"
        @openLink="() => callAction({action: 'openLink', value: localItem})"
        @changeValue="(data) => callAction({action: 'changeValue', value: data.value})"
        @searchOptions="(data) => callAction({action: 'searchOptions', value: data})"
    >
        <template #icon>
            <figure 
                v-if="![null, undefined].includes(activeOption)" 
                class='ibg relation__icon popup_prevent' 
                @click="(event) => {event.preventDefault(); callAction({action: 'openLink', value: localItem})}"
            >
                <img 
                    v-if="![null, undefined].includes(activeOption.file) && activeOption.file != ''"
                    :src='activeOption.file' 
                    :alt='activeOption.text' 
                />
                <figcaption v-else :style="`--backgroundColor: ${[null, undefined].includes(activeOption.color) || activeOption.color == '' ? '#a6b7d4' : activeOption.color}`">
                    {{ activeOption.text.substring(0, 1) }}
                </figcaption>
            </figure>
        </template>

        <template #link>
            <div class="relation__link popup_prevent" @click="(event) => {event.preventDefault(); callAction({action: 'openLink', value: localItem})}"></div>
        </template>
    </AppAutocomplete>
</template>

<script setup>
    import './RelationItem.scss';
    
    import { ref, onMounted, watch } from 'vue'

    import AppAutocomplete from '@/components/AppAutocomplete/Input/Input.vue';

    let activeOption = ref(null)
    let localItem = ref(null)

    const nullOption = {
        id: null,
        sort: 0,
        text: "Не выбрано",
        color: "#a6b7d4",
        file: null
    }

    const props = defineProps({
        item: {
            default: {
                id: 0,
                value: null,
                placeholder: null,
                focus: false,
                key: null,
                options: [],
                lockedOptions: []
            },
            type: Object
        },
        isCanCreate: {
            default: false,
            type: Boolean
        },
        isReadOnly: {
            default: false,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'openLink',
        'callAction',
        'createOption',
        'clickOutside'
    ])

    // Вызов действия
    const callAction = (data) => {
        // Установка выбранной опции
        const setActiveOption = (value) => {
            let findedOption = localItem.value.options == null ? null : localItem.value.options.find(option => option.value == value)

            if ([null, undefined].includes(findedOption)) {
                findedOption = props.item.options == null ? null : props.item.options.find(option => option.value == value)
                if ([null, undefined].includes(findedOption)) {
                    activeOption.value = nullOption 
                    return nullOption
                } else {
                    activeOption.value = findedOption.label
                    localItem.value.options.push(findedOption)
                    return findedOption
                }
            } else {
                activeOption.value = findedOption.label
                return findedOption
            }
        }

        // Получение опций
        const getOptions = () => {
            // Проверка на пустой объект
            const isEmpty = (obj) => {
                for (const prop in obj) {
                    if (Object.hasOwn(obj, prop)) {
                    return false;
                    }
                }
                return true;
            }

            let options = props.item.options == null ? [] : props.item.options.filter(p => p != null && typeof p == 'object' && !Array.isArray(p) && !isEmpty(p)).sort((prev, next) => prev.label.sort - next.label.sort)
            return JSON.parse(JSON.stringify(options))
        }

        // Изменение значения
        const changeValue = (value) => {
            let findedOption = setActiveOption(value)
            emit('callAction', {action: 'changeValue', value: findedOption})
        }

        // Поиск опций
        const searchOptions = (value) => {
            /* Удалить код и вставить свой метод на поиск опций */

            let findedOptions = backupOptions.value.filter(option => option.label.text.toLowerCase().includes(value.value.toLowerCase())) 
            localItem.value.options = findedOptions
            console.log('Поиск опций', findedOptions);
        }

        // Открытие ссылки
        const openLink = () => {
            if (![null, undefined].includes(activeOption.value.id)) {
                emit('openLink', activeOption.value)
            } else {
                return
            }
        }

        switch (data.action) {
            // Установка выбранной опции
            case 'setActiveOption':
                setActiveOption(data.value)
                break;
        
            // Изменение значения
            case 'changeValue':
                changeValue(data.value)
                break;

            // Поиск опций
            case 'searchOptions':
                searchOptions(data.value)
                break;

            // Открытие ссылки
            case 'openLink':
                openLink(data.value)
                break;

            // Получение опций
            case 'getOptions':
                return getOptions()
            default:
                break;
        }
    }

    onMounted(() => {
        localItem.value = JSON.parse(JSON.stringify(props.item))
        callAction({
            action: 'getOptions',
            value: null
        })

        callAction({
            action: 'setActiveOption',
            value: props.item.value
        })
    })

    watch(() => props.item.value, () => {
        localItem.value.value = JSON.parse(JSON.stringify(props.item.value))

        callAction({
            action: 'setActiveOption',
            value: props.item.value
        })
    })

    watch(() => props.item.lockedOptions, () => {
        localItem.value.lockedOptions = props.item.lockedOptions
    })
</script>
