<template>
    <menu class="menu-doc">
        <div class="menu__container">
            <AppH2 class="menu__title">
                Фронтенд
            </AppH2>
            <ul class="menu__list">
                <li 
                    class="menu__item" 
                    v-for="link in Navigation.frontend" 
                    @click="() => emit('changeLink', link)"
                    :class="activeLink.id == link.id ? 'menu__item_active' : ''" 
                >
                    {{ link.name }}
                </li>
            </ul>
        </div>
        <div class="menu__container">
            <AppH2 class="menu__title">
                Бэкенд
            </AppH2>
            <ul class="menu__list">
                <li 
                    class="menu__item" 
                    v-for="link in Navigation.backend" 
                    @click="() => emit('changeLink', link)"
                    :class="activeLink.id == link.id ? 'menu__item_active' : ''" 
                >
                    {{ link.name }}
                </li>
            </ul>
        </div>
    </menu>
</template>

<script setup>
    import './DocMenu.scss';
    
    import { onMounted } from 'vue';

    import AppH2 from '@/components/AppH2/AppH2.vue';
    import Navigation from './Navigation'

    const props = defineProps({
        activeLink: {
            default: {},
            type: Object
        }
    })

    const emit = defineEmits([
        'changeLink'
    ])

    onMounted(() => {
        emit('changeLink', Navigation.frontend[5])
    })
</script>
