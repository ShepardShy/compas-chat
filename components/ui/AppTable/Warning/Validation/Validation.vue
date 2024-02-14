<template>
    <AppWarning class="warning__validation" @closeModal="() => showWarning(false)" :isShow="isShow.state">
        <template #title>
            Ошибка валидации
        </template>

        <template #body>
            <div class="warning__text warning__subtitle">
                ID: <b>{{ activeRow == null ? null : activeRow.id }}</b>
            </div>
            <div class="warning__text">
                Необходимо заполнить обязательные поля
            </div>
            <div class="warning__list warning-list">
                <div class="warning-list__field" v-for="item in fields.filter(p => p.key != 'id' && activeRow[p.key] != undefined)">
                    <AppRelation 
                        v-if="item.type == 'relation'"
                        :item="{
                            key: item.key,
                            type: item.type,
                            id: activeRow.id,
                            title: item.title,
                            substring: item.unit,
                            value: activeRow[item.key].value,
                            is_link: item.is_link,
                            is_plural: item.is_plural,
                            hiddenOptions: item.choosed,
                            related_table: item.related_table,
                            is_external_link: item.is_external_link,
                            options: ['status', 'relation'].includes(item.type) ? item.options : null,
                            external_link: activeRow[item.key].value != undefined ? activeRow[item.key].value.external_link : null,
                        }"
                        :isCanCreate="true"
                        :isUseEnter="false"
                        :enabledAutocomplete="false"
                        :isReadOnly="false"
                        :isMultiple="Boolean(item.is_plural)"
                        @changeValue="(data) => changeValue(activeRow.id, data)"
                    />
                    <AppTextarea 
                        v-else-if="['number', 'password', 'text'].includes(item.type)"
                        :item="{
                            key: item.key,
                            type: item.type,
                            id: activeRow.id,
                            title: item.title,
                            substring: item.unit,
                            value: [null, undefined].includes(activeRow[item.key].value) ? null : String(activeRow[item.key].value),
                            is_link: item.is_link,
                            is_plural: item.is_plural,
                            hiddenOptions: item.choosed,
                            related_table: item.related_table,
                            is_external_link: item.is_external_link,
                            options: ['status', 'relation'].includes(item.type) ? item.options : null,
                            external_link: activeRow[item.key].value != undefined ? activeRow[item.key].value.external_link : null,
                        }"
                        :isCanCreate="true"
                        :isUseEnter="false"
                        :enabledAutocomplete="false"
                        :isReadOnly="false"
                        :isMultiple="Boolean(item.is_plural)"
                        @changeValue="(data) => changeValue(activeRow.id, data)"
                    />
                    <AppStatus 
                        v-else-if="item.type == 'status'"
                        :item="{
                                key: item.key,
                                type: item.type,
                                id: activeRow.id,
                                title: item.title,
                                substring: item.unit,
                                value: activeRow[item.key].value,
                                is_link: item.is_link,
                                is_plural: item.is_plural,
                                hiddenOptions: item.choosed,
                                related_table: item.related_table,
                                is_external_link: false,
                                options: item.options,
                                external_link: null,
                            }"
                            :isCanCreate="false"
                            :isHaveNullOption="false"
                            :isUseEnter="false"
                            :enabledAutocomplete="false"
                            :isReadOnly="false"
                            :isMultiple="Boolean(item.is_plural)"
                            @changeValue="(data) => changeValue(activeRow.id, data)"
                    />
                    <AppSelect 
                        v-else-if="item.type == 'select_dropdown'"
                        :item="{
                            id: activeRow.id,
                            key: item.key,
                            value: activeRow[item.key].value,
                            focus: false,
                            required: Boolean(item.required),
                            title: item.title,
                            options: item.options,
                            lockedOptions: []
                        }"
                        :isReadOnly="false"
                        :isHaveNullOption="true"
                        :isMultiple="Boolean(item.is_plural)"
                        :isFiltered="true"
                        @changeValue="(data) => changeValue(activeRow.id, data)"
                    />
                    <div class="warning-list__field-error">
                        {{ activeRow[item.key].error }}
                    </div>
                </div> 
            </div>
            <div class="warning__text warning__progress">
                {{ activePage + 1 }} из {{ invalidRows.length }}
            </div>

            <div class="warning__actions">
                <AppButton v-show="activePage < invalidRows.length - 1" class="button_blue" @click="() => changeActiveRow(activePage + 1)">
                    Далее
                </AppButton>
                <AppButton v-show="activePage == invalidRows.length - 1" class="button_blue" @click="() => emit('callAction', {action: 'save', value: true})">
                    Сохранить
                </AppButton>
                <AppButton v-show="activePage > 0" @click="() => changeActiveRow(activePage - 1)">
                    Назад
                </AppButton>
                <AppButton @click="() => showWarning(false)">
                    Отмена
                </AppButton>
            </div>
        </template>
    </AppWarning>
</template>

<script setup>
    import './Validation.scss';
    
    import { ref, inject, onMounted } from 'vue'

    import AppButton from '@/components/AppButton/AppButton.vue';
    import AppWarning from '@/components/AppWarning/AppWarning.vue';

    import AppStatus from '@/components/AppSelects/Status/Status.vue'
    import AppSelect from '@/components/AppSelects/Select/Select.vue'
    import AppTextarea from "@/components/AppInputs/Textarea/Textarea.vue"
    import AppRelation from "@/components/AppSelects/Relation/Relation.vue"

    const isShow = inject('isShow')
    const fields = inject('fields')
    const bodyData = inject('bodyData')
    const invalidRows = inject('invalidRows')
    
    let activePage = ref(0)
    let activeRow = ref(invalidRows.value[0])

    const emit = defineEmits([
        'callAction'
    ])

    onMounted(() => {
        activeRow.value = invalidRows.value[0]
    })

    // Показать окно предупреждения
    const showWarning = (state) => {
        isShow.value.state = state
    } 

    // Изменение значения
    const changeValue = (id, data) => {
        let findedIndexBody = bodyData.value.findIndex(p => p.id == id)
        let findedIndexInvalid = invalidRows.value.findIndex(p => p.id == id)
        bodyData.value[findedIndexBody][data.key] = data.value
        invalidRows.value[findedIndexInvalid][data.key].value = data.value
    }

    // Смена отображаемой строки
    const changeActiveRow = (page) => {
        activePage.value = page
        activeRow.value = invalidRows.value[page]
    }
</script>
