<template>
    <aside class="menu menu_mobile">
        <IconGamburger 
            class="menu__gamburger"
            @click="() => callAction({action: 'showMenu', value: true})"
        />

        <div class="menu__content" v-show="settingsMenu.isShow">
            <AppH2 class="menu__nav-back" @click="() => callAction({action: 'navigateMenu', value: settingsMenu.activeTab == null ? false : null})">
                <IconArrow />
                {{ settingsMenu.activeTab == null ? 'Меню' : settingsMenu.activeTab.title }}
            </AppH2>

            <nav class="menu__list" v-if="settingsMenu.activeTab == null">
                <a href="" class="menu__item" :class="activeLink.link == item.link ? 'menu__item_active' : ''" v-for="item in menuVisible" :key="item.id">
                    {{ item.name }}
                </a>
            </nav>
            <nav class="menu__list" v-else-if="settingsMenu.activeTab.tab == 'hidden'">
                <a href="" class="menu__item" v-for="item in menuHidden" :key="item.id">
                    {{ item.name }}
                </a>
            </nav>
            <nav class="menu__list" v-else-if="settingsMenu.activeTab.tab == 'user'">
                <a href="" class="menu__item">
                    Настройки
                </a>
                <a href="" class="menu__item menu__item_red">
                    Выйти
                </a>
            </nav>

            <div 
                class="menu__item menu_other" 
                v-show="settingsMenu.activeTab == null"
                @click="() => callAction({action: 'navigateMenu', value: 'hidden'})"
            >
                Еще
                <IconArrow />
            </div>

            <div class="menu_other menu__item" v-show="settingsMenu.activeTab == null" @click="() => callAction({action: 'navigateMenu', value: 'user'})"> 
                <div 
                    class="menu__user menu-user">
                    <figure class='ibg menu-user__icon'>
                        <img src='https://compas.pro/storage/thumbnails/default/9k/oh/2sx8nf8ckw08oo0c8oo0w.png?heighten=200&p=opt6.compas.pro%2Fstorage%2Ftenantopt6%2Fapp%2Fpublic%2Ffiles%2FkxEq2hibJKYASgJ73AXf3xbRPKSIbnWv71Ki4yvb.png&s=https' alt=''>
                    </figure>
                    <div class="menu-user__title">
                        Денис Потемкин
                    </div>
                </div>
                <IconArrow />
            </div>
        </div>
    </aside>
</template>

<script setup>
    import './Mobile.scss';

    import IconArrow from '@/components/AppIcons/Arrow/Arrow.vue'
    import IconGamburger from '@/components/AppIcons/Gamburger/Gamburger.vue'

    import AppH2 from '@/components/AppH2/AppH2.vue'

    import { ref, inject } from 'vue'

    let settingsMenu = ref({
        tabs: [
            {
                tab: 'hidden',
                title: 'Еще',
            },
            {
                tab: 'user',
                title: 'Денис Потемкин',
            }
        ],
        isShow: false,
        activeTab: null
    })    

    const menuVisible = inject('menuVisible')
    const menuHidden = inject('menuHidden')
    const activeLink = inject('activeLink')

    // Вызов действий
    const callAction = (data) => {
        // Показ/скрытие меню
        const showMenu = (state) => {
            settingsMenu.value.isShow = state
        }

        // Навигация по меню
        const navigateMenu = (value) => {
            if (value == false) {
                showMenu(false)
            } else {
                settingsMenu.value.activeTab = settingsMenu.value.tabs.find(tab => tab.tab == value) ?? null
            }
        }

        switch (data.action) {
            // Показ/скрытие меню
            case 'showMenu':
                showMenu(data.value)
                break;
        
            // Навигация по меню
            case 'saveSettings':
                navigateMenu(data.value)
                break;
            default:
                break;
        }
    }
</script>
