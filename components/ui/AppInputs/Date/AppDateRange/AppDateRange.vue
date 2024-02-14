<template>
    <FormItem class="form__item_datepicker datepicker_range" :required="props.item.required">
        <div class="table__item-content_title">
            {{ props.item.title }}
        </div>
        <VueDatePicker 
            range 
            multi-calendars
            auto-apply
            locale="ru"
            ref="datepicker"
            position="left"
            hide-offset-dates
            format="dd.MM.yyyy"
            placeholder="__.__.____ — __.__.____"
            v-model="props.item.value"
            :enable-time-picker="false" 
            :max-time="{ hours: 0, minutes: 0, seconds: 0 }"
            :text-input-options="{format: 'dd.MM.yyyy'}"
            :month-change-on-scroll="false"
            @open="event => hideAllDetails(event)"
            @closed="showMenu = false"
            @update:modelValue="(e) => {
                selectDate({id: props.item.id, key: props.item.type, value: e})
                localItem.date = e
            }" 
        > 
            <template #right-sidebar>
                <div class="datapicker__preset-days">
                    <div class="datapicker__preset-item" v-for="day in presetDates" :class="setClassSidebar(localItem, day.day)" @click="() => setPresetDate(day)">
                        {{ day.title }}
                    </div>
                </div>
            </template>

            <template #left-sidebar>
                <AppDateRangeFooter 
                    :item="props.item"
                    @selectDate="(data) => selectDate(data)"
                />
            </template>
        </VueDatePicker>

        <div class="datepicker__mirror" :class="showMenu ? 'datepicker__mirror_active' : ''">
            {{ setMirrorValue }}
        </div>
    </FormItem>
</template>

<script setup>
    import './AppDateRange.scss';
    import '../AppDate.scss';

    import FormItem from '@/components/AppForm/FormItem/FormItem.vue';
    import AppDateRangeFooter from './AppDateRangeFooter/AppDateRangeFooter.vue'

    import commonScripts from '@/helpers/commonScripts';
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import DateScripts from '../DateScripts';

    // Локальная переменная для взаимодействия с v-model
    let showMenu = ref(false)
    let localItem = ref({})
    let presetDates = ref([
        {
            id: 1,
            title: 'Сегодня',
            range: 'today',
            day: DateScripts.setTimeRange('today', true)
        },
        {
            id: 2,
            title: 'Завтра',
            range: 'tommorow',
            day: DateScripts.setTimeRange('tommorow', true)
        },
        {
            id: 3,
            title: 'Текущий месяц',
            range: 'currentMonth',
            day: DateScripts.setTimeRange('currentMonth', true)
        },
        {
            id: 4,
            title: 'Прошлый месяц',
            range: 'prevMonth',
            day: DateScripts.setTimeRange('prevMonth', true)
        },
        {
            id: 5,
            title: 'Текущий год',
            range: 'currentYear',
            day: DateScripts.setTimeRange('currentYear', true)
        },
        {
            id: 6,
            title: 'Прошлый год',
            range: 'prevYear',
            day: DateScripts.setTimeRange('prevYear', true)
        }
    ])

    const datepicker = ref(null);

    const hideAllDetails = (event) => {
        emit('openDatepicker', true)
        showMenu.value = true
        commonScripts.hideAllDetails('details', event)
        let menu = document.querySelector('.dp__menu')
        let datepickerField = menu.closest('.form__item')
        let rect = menu.getBoundingClientRect()
        let eventHeight = rect.y + rect.height + datepickerField.offsetHeight + 5



        if (eventHeight > window.innerHeight) {
            menu.classList.add('dp__menu_up')
        } else {
            let node = document.querySelectorAll('.dp__menu_up')
            for (let elem of node) {
                elem.classList.remove('select__options_up')
            }
        }
    }

    // Установка даты из пресета по клику
    const setPresetDate = (date) => {
        localItem.value.value = date.day
        selectDate(localItem.value)
        datepicker.value.closeMenu();
    }

    // Установка даты для отправки на сервер
    const selectDate = (data) => {
        emit('changeValue', data)
        datepicker.value.closeMenu();
    }

    // Установка класса для сайдбара
    const setClassSidebar = (localItem, day) => {

        if (transformDate(localItem.value[0]) == transformDate(day[0]) && transformDate(day[1]) == transformDate(localItem.value[1])) {
            return 'datapicker__preset-item_active'
        } else {
            return ''
        }
    }

    // Преобразование даты в необходимый формат
    const transformDate = (data) => {
        return new Date(data).getTime() / 1000
    }

    // Преобразование даты в необходимый формат
    const transformHumanDate = (data) => {
        let date = new Date(data)
        return `${date.toLocaleString().split(',')[0]}`
    }

    const setMirrorValue = computed(() => {
        if (props.item.value == '' || props.item.value.length == 0 || props.item.value == null) {
            return "__.__.____ — __.__.____"
        } else {
            let startDate = transformHumanDate(props.item.value[0])
            let endDate = transformHumanDate(props.item.value[1])
            if (startDate == endDate) {
                return startDate
            } else {
                return `${startDate} — ${endDate}`
            }
        } 
    })

    const props = defineProps({
        item: {
            default: {
                id: 0,
                value: '',
                type: "date",
                key: '',
                placeholder: '',
                typeComponent: 'input',
                title: "Undefined title"
            },
            type: Object
        }
    })

    const emit = defineEmits([
        'openDatepicker',
        'changeValue'
    ])

    onMounted(() => {
        localItem.value = props.item
        localItem.value.key = props.item.key
        localItem.value.value = props.item.value
    })
</script> 