<template>
    <div class="datapicker__footer">
        <div class="datepicker__inputs">
            <AppInput 
                v-mask="'##.##.####'"
                :item="{
                    id: 0,
                    value: startDate,
                    type: 'text',
                    focus: false,
                    key: 'startDate',
                    typeComponent: 'input',
                    placeholder: '__.__.____',
                    title: ''
                }"
                :enabledAutocomplete="false"
                @changeValue="(data) => changeValue(data)"
            />

                —

            <AppInput 
                v-mask="'##.##.####'"
                :item="{
                    id: 0,
                    value: endDate,
                    type: 'text',
                    focus: false,
                    key: 'endDate',
                    typeComponent: 'input',
                    placeholder: '__.__.____',
                    title: ''
                }"
                :enabledAutocomplete="false"
                @changeValue="(data) => changeValue(data)"
            />
        </div>

        <AppButton class="button_blue datepicker__button" @click="() => selectDate()">
            Применить
        </AppButton>
    </div>
</template>

<script setup>
    import './AppDateRangeFooter.scss';
    
    import AppInput from '@/components/AppInput/AppInput.vue';
    import AppButton from '@/components/AppButton/AppButton.vue'

    let startDate = ref()
    let endDate = ref()
    
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
        'selectDate',
        'changeValue'
    ])

    // Преобразование даты в необходимый формат
    const transformDateInput = (data) => {
        let date = new Date(data)
        return `${date.toLocaleString().split(',')[0].split('.').join('-')}`
    }

    // Преобразование даты в необходимый формат
    const transformDate = (data) => {
        data = data.split('.').reverse().join('-')
        return new Date(data)
    }

    const changeValue = (data) => {
        // if (data.key == 'startDate') {
        //     startDate.value = data.value
        // } else if (data.key == 'endDate') {
        //     endDate.value = data.value
        // }
    }

    const selectDate = () => {
        emit('selectDate', {
            id: props.item.id, 
            key: props.item.type,
            value: [transformDate(startDate.value), transformDate(endDate.value)]
        })
    }

    onMounted(() => {
        if (Array.isArray(props.item.value)) {
            startDate.value = transformDateInput(props.item.value[0])
            endDate.value = transformDateInput(props.item.value[1])
        }
    })
</script>
