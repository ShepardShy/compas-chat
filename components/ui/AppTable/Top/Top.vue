<template>
    <div class="table-template__header table-top">
        <AppSelect 
            class="table-top__item table-top__select"
            :class="sortItem.order == 'asc' ? 'table-top__select_up' : ''"
            :item="{
                id: 0,
                key: 'sortTable',
                value: sortItem.key,
                focus: false,
                required: false,
                title: null,
                lockedOptions: [],
                options: options
            }"
            :isFiltered="false"
            :isMultiple="false"
            :isReadOnly="false"
            :isHaveNullOption="true"
            @changeValue="(data) => sortTable(data)"
        />
        <PopupSave 
            class="table-top__item"
            v-show="menu.saves.isShow"
            @saveSettings="(role) => callAction({action: 'saveSettings', value: role})"
        />
        <AppPopup class="table-top__item" :closeByClick="true">
            <template #summary>
                <IconDots />
            </template>
            <template #content>
                <PopupOption @click="() => callAction({action: 'downloadExcel', value: null})">
                    Скачать Excel
                </PopupOption>
            </template>
        </AppPopup>
        <AppPopup class="table-top__item" :closeByClick="false" @clickOutside="() => callAction({action: 'changeTab', value: null})">
            <template #summary>
                <IconSettings />
            </template>
            <template #content>
                <template v-if="menu.activeTab == null">
                    <PopupOption class="popup-option__sublink" v-for="tab in menu.tabs" @click="() => callAction({action: 'changeTab', value: tab})">
                        {{ tab.title }} 

                        <IconArrow />
                    </PopupOption>
                </template>
                <template v-else>
                    <PopupOption class="popup-option__sublink popup-option__sublink_back" @click="() => callAction({action: 'changeTab', value: null})">
                        <IconArrow />
                        
                        {{ menu.activeTab.title }}
                    </PopupOption>

                    <template v-if="menu.activeTab.tab == 'order'">
                        <draggable 
                            ref="draggableRef"
                            class="popup-option__draggable"
                            group="table-top__item" 
                            itemKey="table-top__item"
                            v-model="fields" 
                            handle=".icon__draggable"
                            @end="(event) => callAction({action: 'dragEnd', value: event})" 
                            @start="(event) => callAction({action: 'dragStart', value: event})" 
                        >
                            <template #item="{ element: option }">
                                <PopupOption class="popup-option__sublink" v-show="option.enabled">
                                    <IconDrag /> 
                                    {{ option.title }}
                                </PopupOption>
                            </template>
                        </draggable>
                    </template>
                    <template v-else>
                        <PopupOption class="popup__option_checkbox" v-for="option in menu.activeTab.tab == 'enabled' ? fields : fields.filter(p => p.enabled)">
                            <AppCheckbox 
                                :item="{
                                    id: option.id,
                                    title: option.title,
                                    type: 'checkbox',
                                    disabled: false, 
                                    value: menu.activeTab.tab == 'enabled' ? option.enabled : option.fixed,
                                    options:  null,
                                    key: option.key                           
                                }"
                                @changeValue="(data) => callAction({action: 'changeValue', value: data})"
                            />                            
                        </PopupOption>
                    </template>
                </template>
            </template>
        </AppPopup>
    </div>
</template>

<script setup>
    import './Top.scss';
    
    import { ref, inject, onMounted } from 'vue'

    import IconDots from '@/components/AppIcons/Dots/Dots.vue'
    import IconDrag from '@/components/AppIcons/Drag/Drag.vue'
    import IconArrow from '@/components/AppIcons/Arrow/Arrow.vue'
    import IconSettings from '@/components/AppIcons/Settings/Settings.vue'
    
    import draggable from 'vuedraggable'
    import resizeTable from '../Header/resizeTable.js'
    import AppPopup from '@/components/AppPopup/Popup.vue';
    import PopupSave from '@/components/AppPopup/Save/Save.vue';
    import AppSelect from '@/components/AppSelects/Select/Select.vue'
    import AppCheckbox from '@/components/AppInputs/Checkbox/Checkbox.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';
    
    const draggableRef = ref(null)
    
    let options = ref([])
    
    const menu = inject('menu')
    const fields = inject('fields')
    const sortItem = inject('sortItem')
    const tableRef = inject('tableRef')
    
    const emit = defineEmits([
        'callAction'
    ])

    onMounted(() => {
        setOptions()
    })

    // Действия с шапкой
    const callAction = (data) => {
        // Смена активной вкладки
        const changeTab = (tab) => {
            setTimeout(() => {
                menu.value.activeTab = tab
            }, 10);
        }

        // Изменение значений опций
        const changeValue = (data) => {
            let findedOption = fields.value.find(option => option.key == data.key)
            findedOption[menu.value.activeTab.tab] = data.value
            showSaves(true)

            if (menu.value.activeTab.tab == 'enabled') {
                setTimeout(() => {
                    resizeTable.resizableGrid(tableRef.value, fields.value)
                }, 100);
            }
        }

        // Начало перетаскивания опции
        const dragStart = () => {
            draggableRef.value.targetDomElement.classList.add("popup-option__draggable_dragging")
        }

        // Конец перетаскивания опции
        const dragEnd = (value) => {
            fields.value = value.to.__draggable_component__.modelValue
            showSaves(true)
        }

        // Сохранение настроек полей для выбранной роли
        const saveSettings = (role) => {
            showSaves(false)
            emit('callAction', {
                action: 'saveFields', 
                value: {
                    role: role, 
                    fields: fields
                }
            })
        }

        // Открытие/скрытие окна сохранения
        const showSaves = (state) => {
            menu.value.saves.isShow = state
        }

        // Скачивание экселя
        const downloadExcel = () => {
            emit('callAction', {
                action: 'downloadExcel',
                value: fields.value
            })
        }

        switch (data.action) {
            // Смена активной вкладки
            case "changeTab":
                changeTab(data.value)
                break;

                // Конец перетаскивания опции
            case "dragStart":
                dragStart()
                break;

                // Начало перетаскивания опции
            case "dragEnd":
                dragEnd(data.value)
                break;

            // Изменение значений опций
            case "changeValue":
                changeValue(data.value)
                break;

            // Открытие/скрытие окна сохранения
            case 'saveSettings':
                saveSettings(data.value)
                break;

            // Открытие/скрытие окна сохранения
            case "showSaves":
                showSaves(data.value)
                break;

            // Скачивание экселя
            case 'downloadExcel':
                downloadExcel()
                break;
            default:
                break;
        }
    }

    // Сортировка таблицы
    const sortTable = (data) => {
        if (data.value == sortItem.value.key) {
            sortItem.value.order = sortItem.value.order == 'asc' ? 'desc' : 'asc'
        } else {
            sortItem.value.key = data.value
            sortItem.value.order = 'desc'
        }

        emit('callAction', {
            action: 'getTableData',
            value: null
        })
    }

    // Установка полей для сортировке в мобильной версии
    const setOptions = () => {
        let localFields = JSON.parse(JSON.stringify(fields.value))
        let localOptions = []

        for (let field of localFields) {
            localOptions.push({
                label: field.title,
                value: field.key
            })
        }

        options.value = localOptions 
    }

</script>
