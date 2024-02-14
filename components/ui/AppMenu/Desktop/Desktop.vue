<template>
    <aside class="menu menu_desktop" ref="menuRef">
        <a :href="menu.length > 0 ? menu[0].link : '/'" class="menu__logo">
            <IconLogo />
        </a>

        <div class="menu__content">
            <draggable 
                v-if="menu.length > 0"
                tag="nav" 
                class="menu__list"
                group="menu-list" 
                itemKey="menu-visible"
                v-model="menuVisible" 
                handle=".icon__draggable"
                @start="() => callAction({action: 'dragStart', value: event})"
                @end="(event) => callAction({action: 'dragEnd', value: event})" 
            >
                <template #item="{ element: item }">
                    <li class="menu__item" 
                        :key="item.id" 
                        v-show="item.enabled"
                        :class="activeLink.link == item.link ? 'menu__item_active' : ''"
                    >
                        <IconDrag />
                        {{ item.name }}
                    </li>
                </template>
            </draggable>

            <details class="menu__item-details" ref="detailsMenuRef">
                <summary class="menu__item">
                    <span class="menu__item-subtitle">
                        Еще
                    </span>

                    <div class="menu__item-hide">
                        <span class="menu__item-subtitle">
                            Скрытые
                        </span>
                    </div>
                </summary>

                <nav class="menu__list">
                    <draggable 
                        v-if="menu.length > 0"
                        group="menu-list" 
                        itemKey="menu-hidden"
                        v-model="menuHidden" 
                        handle=".icon__draggable"
                        @start="() => callAction({action: 'dragStart', value: event})"
                        @end="(event) => callAction({action: 'dragEnd', value: event})" 
                    >
                        <template #item="{ element: item }">
                            <li class="menu__item" 
                                :key="item.id" 
                                v-show="item.enabled"
                                :class="activeLink.link == item.link ? 'menu__item_active' : ''"
                            >
                                <IconDrag />
                                {{ item.name }}
                            </li>
                        </template>
                    </draggable>

                    <li class="menu__item menu__item-close" @click="() => detailsMenuRef.removeAttribute('open')">
                        Скрыть
                    </li>
                </nav>
            </details>
        </div>

        <div class="menu__settings">
            <AppPopup class="popup__settings" :closeByClick="false" @clickOutside="() => callAction({action: 'changeTab', value: null})">
                <template #summary>
                    <IconSettings />
                </template>
                <template #content>
                    <template v-if="settingsMenu.activeTab == null">
                        <PopupOption class="popup-option__sublink" v-for="tab in settingsMenu.tabs" @click="() => callAction({action: 'changeTab', value: tab})">
                            {{ tab.title }} 
                            
                            <IconArrow />
                        </PopupOption>
                    </template>
                    <template v-else>
                        <PopupOption class="popup-option__sublink popup-option__sublink_back" @click="() => callAction({action: 'changeTab', value: null})">
                            {{ settingsMenu.activeTab.title }}
                            <IconArrow />
                        </PopupOption>

                        <template v-if="settingsMenu.activeTab.tab == 'order'">
                            <draggable 
                                ref="draggableRef"
                                class="popup-option__draggable"
                                group="popup-menu__settings" 
                                itemKey="settings-visible"
                                v-model="menuVisible" 
                                handle=".icon__draggable"
                                @end="(event) => callAction({action: 'settingsDragEnd', value: event})" 
                            >
                                <template #item="{ element: option }">
                                    <PopupOption class="popup-option__sublink" v-show="option.enabled">
                                        <IconDrag /> 
                                        {{ option.name }}
                                    </PopupOption>
                                </template>
                            </draggable>
                            <div class="menu__item-hide">
                                <span class="menu__item-subtitle">
                                    Скрытые
                                </span>
                            </div>
                            <draggable 
                                ref="draggableRef"
                                class="popup-option__draggable"
                                group="popup-menu__settings" 
                                itemKey="settings-hidden"
                                v-model="menuHidden" 
                                handle=".icon__draggable"
                                @end="(event) => callAction({action: 'settingsDragEnd', value: event})" 
                            >
                                <template #item="{ element: option }">
                                    <PopupOption class="popup-option__sublink" v-show="option.is_hidden">
                                        <IconDrag /> 
                                        {{ option.name }}
                                    </PopupOption>
                                </template>
                            </draggable>
                        </template>
                        <template v-else>
                            <PopupOption class="popup__option_checkbox" v-for="option in settingsMenu.activeTab.tab == 'enabled' ? menu : menu.filter(p => p.enabled)">
                                <AppCheckbox 
                                    :item="{
                                        id: option.id,
                                        title: option.name,
                                        type: 'checkbox',
                                        disabled: false, 
                                        value: option.enabled,
                                        options:  null,
                                        key: option.slug                           
                                    }"
                                    @changeValue="(data) => callAction({action: 'changeValue', value: data})"
                                />                            
                            </PopupOption>
                        </template>
                    </template>
                </template>
            </AppPopup>
            <PopupSave 
                v-show="settingsMenu.saves.isShow"
                @saveSettings="(role) => callAction({action: 'saveSettings', value: role})"
            />
        </div>

        <AppPopup :closeByClick="true" class="popup__menu">
            <template #summary>
                <div class="menu__user menu-user menu__item">
                    <figure class='ibg menu-user__icon'>
                        <img src='https://compas.pro/storage/thumbnails/default/9k/oh/2sx8nf8ckw08oo0c8oo0w.png?heighten=200&p=opt6.compas.pro%2Fstorage%2Ftenantopt6%2Fapp%2Fpublic%2Ffiles%2FkxEq2hibJKYASgJ73AXf3xbRPKSIbnWv71Ki4yvb.png&s=https' alt=''>
                    </figure>
                    <div class="menu-user__title">
                        Денис Потемкин
                    </div>
                </div>
            </template>
            <template #content>
                <PopupOption>
                    Настройки
                </PopupOption>
                <PopupOption class="popup__option_red">
                    Выйти
                </PopupOption>
            </template>
        </AppPopup>
    </aside>
</template>
    
<script setup>
    import './Desktop.scss'

    import { ref, inject } from 'vue'
    import draggable from 'vuedraggable'

    import IconDrag from '@/components/AppIcons/Drag/Drag.vue'
    import IconLogo from '@/components/AppIcons/Logo/Logo.vue'
    import IconArrow from '@/components/AppIcons/Arrow/Arrow.vue'
    import IconSettings from '@/components/AppIcons/Settings/Settings.vue'

    import AppPopup from '@/components/AppPopup/Popup.vue'
    import PopupSave from '@/components/AppPopup/Save/Save.vue'
    import AppCheckbox from '@/components/AppInputs/Checkbox/Checkbox.vue'
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue'

    let settingsMenu = ref({
        tabs: [
            {
                tab: 'enabled',
                title: 'Сущности',
            },
            {
                tab: 'order',
                title: 'Порядок',
            }
        ],
        saves: {
            isShow: false
        },
        activeTab: null
    })

    const menuRef = ref(null)
    const detailsMenuRef = ref(null)

    const menu = inject('menu')
    const menuVisible = inject('menuVisible')
    const menuHidden = inject('menuHidden')
    const activeLink = inject('activeLink')

    const emit = defineEmits([
       'callAction'
    ])

    // Вызов действий
    const callAction = (data) => {
        // Смена активной вкладки
        const changeTab = (tab) => {
            setTimeout(() => {
                settingsMenu.value.activeTab = tab
            }, 10);
        }

        // Изменение значений опций
        const changeValue = (data) => {
            let findedOption = menu.value.find(option => option.slug == data.key)
            findedOption[settingsMenu.value.activeTab.tab] = data.value
            saveSettings('myself')
        }

        // Начало перетаскивания опции
        const dragStart = () => {
            menuRef.value.classList.add('menu_draggable')
        }

        // Конец перетаскивания опции
        const dragEnd = (event) => {
            if (event.to.__draggable_component__.itemKey == 'menu-hidden') {
                let findIndex = menuHidden.value.findIndex(item => item.id == event.target.__draggable_component__.context.element.id)
                menuHidden.value[findIndex].is_hidden = 1
            } else {
                let findIndex = menuVisible.value.findIndex(item => item.id == event.target.__draggable_component__.context.element.id)
                menuVisible.value[findIndex].is_hidden = 0
            }

            menu.value = menuVisible.value.concat(menuHidden.value)
            menuRef.value.classList.remove('menu_draggable')

            callAction({action: 'showSaves', value:true})
        }

        // Конец перетаскивания опции в настройках
        const settingsDragEnd = (event) => {
            if (event.to.__draggable_component__.itemKey == 'settings-hidden') {
                let findIndex = menuHidden.value.findIndex(item => item.id == event.target.__draggable_component__.context.element.id)
                menuHidden.value[findIndex].is_hidden = 1
            } else {
                let findIndex = menuVisible.value.findIndex(item => item.id == event.target.__draggable_component__.context.element.id)
                menuVisible.value[findIndex].is_hidden = 0
            }

            menu.value = menuVisible.value.concat(menuHidden.value)
            showSaves(true)
        }

        // Сохранение настроек полей для выбранной роли
        const saveSettings = (role) => {
            showSaves(false)
            emit('callAction', {
                action: 'saveSettings',
                value: {
                    role: role, 
                    fields: menu.value
                }
            })
        }

        // Открытие/скрытие окна сохранения
        const showSaves = (state) => {
            settingsMenu.value.saves.isShow = state
        }

        switch (data.action) {
            // Смена активной вкладки
            case "changeTab":
                changeTab(data.value)
                break;

            // Начало перетаскивания опции
            case "dragStart":
                dragStart()
                break;

            // Конец перетаскивания опции
            case "dragEnd":
                dragEnd(data.value)
                break;

            // Конец перетаскивания опции в настройках
            case 'settingsDragEnd':
                settingsDragEnd(data.value)

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

            default:
                break;
        }
    }
</script>
    