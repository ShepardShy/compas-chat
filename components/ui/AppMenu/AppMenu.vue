<template>
    <MenuDesktop 
        @callAction="(data) => emit('callAction', data)"
    />
    <MenuMobile />
</template>

<script setup>
    import './AppMenu.scss';

    import { ref, provide, onMounted } from 'vue'
   
   import MenuDesktop from './Desktop/Desktop.vue'
   import MenuMobile from './Mobile/Mobile.vue'

   const props = defineProps({
       menu: {
           default: [],
           type: Array
       }
   })

   const emit = defineEmits([
       'callAction'
   ])

    let menu = ref([])

    let menuVisible = ref([])
    let menuHidden = ref([])
    let activeLink = ref({})

    provide('menu', menu)
    provide('menuHidden', menuHidden)
    provide('activeLink', activeLink)
    provide('menuVisible', menuVisible)

    // Вызов действий
    const callAction = (data) => {
        // Установка полей в меню
        const setMenu = () => {
            menu.value = Array.isArray(props.menu) ? JSON.parse(JSON.stringify(props.menu)) : []
        }

        // Установка полей в меню
        const setFields = () => {
            menuVisible.value = menu.value.filter(item => !item.is_hidden)
            menuHidden.value = menu.value.filter(item => item.is_hidden)
        }

        // Установка активной ссылки
        const setActiveLink = () => {
            // Проверка переменной на число
            const isInteger = (value) => {
                return /^\d+$/.test(value);
            }

            // Определение является ли ссылка активной
            const matchLink = (link) => {
                let routePath = '/field_3'
                let routeMatch = routePath.match(link)
                if (routeMatch != null) {
                    if (routeMatch.input.substr(routeMatch.input.length - 1) == '/') {
                        routeMatch.input = routeMatch.input.slice(0, -1)
                    } else {
                        let routeString = routeMatch.input.split('/')
                        if (isInteger(routeString[routeString.length - 1])) {
                            routeString.pop()
                            routeMatch.input = routeString.join('/')
                        }
                    }
                }
                return routeMatch != null
            }

            activeLink.value = menu.value.find(option => matchLink(option.link))
        }

        switch (data.action) {
            // Установка полей в меню
            case 'setFields':
                setFields()
                break;

            // Установка активной ссылки
            case 'setActiveLink': 
                setActiveLink()
                break;
        
            // Установка полей в меню
            case 'setMenu':
                setMenu()
                break;

            default:
                break;
        }
    }

    onMounted(() => {
        callAction({action: 'setMenu', value: null})
        callAction({action: 'setFields', value: null})
        callAction({action: 'setActiveLink', value: null})
    })

</script>
