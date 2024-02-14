<template>
    <div class="table-template__body_mobile">
        <div class="table-mobile" :class="bodyData.length == 0 ? 'table-mobile_empty' : ''">
            <div 
                v-for="row in bodyData" 
                class="table-mobile__row table__row" 
                :class="row.isEdit ? 'table__row_edit' : row.isChoose ? 'table__row_choosed' : '', row.isUpdated ? 'table__row_updated' : ''"
            >
                <div 
                    v-for="item in fields" 
                    class="table-mobile__field table__item" 
                    :class="!item.enabled ? 'table__item_hidden' : ''"
                    @click="(event) => doubleClick(event, row, item)" 
                >
                    <AppCheckbox 
                        v-if="item.type == 'checkbox'"
                        :item="{
                            isHTML: false,
                            id: row.id,
                            key: item.key,
                            title: item.title,
                            value: row[item.key],
                            required: Boolean(item.required)
                        }"
                        :disabled="actionState == 'saving'"
                        @changeValue="(data) => changeValue(row.id, data)"
                    />
                    <AppRelation 
                        v-else-if="item.type == 'relation'"
                        :item="{
                            focus: false,
                            id: row.id,
                            placeholder: null,
                            key: item.key,
                            title: item.title,
                            value: row[item.key],
                            required: Boolean(item.required),
                            options: ['status', 'relation'].includes(item.type) ? item.options : null,
                            lockedOptions: item.choosed,
                        }"
                        :isCanCreate="true"
                        :isMultiple="Boolean(item.is_plural)"
                        :isReadOnly="Boolean(item.read_only || !row.isEdit)"
                        @changeValue="(data) => changeValue(row.id, data)"
                        @openLink="(data) => callAction({action: 'openLink', value: {id: data.id, slug: item.related_table}})"
                        @showAll="() => callAction({action: 'openLink', value: {id: row.id, slug: props.slug, tab: item.related_table}})"
                        @createOption="() => emit('callAction', {action: 'createOption', value: item.related_table})"
                    />
                    <AppTextarea 
                        v-else-if="['number', 'password', 'text'].includes(item.type)"
                        :item="{
                            focus: false,
                            id: row.id,
                            placeholder: null,
                            key: item.key,
                            type: item.type,
                            title: item.title,
                            substring: item.unit,
                            required: Boolean(item.required),
                            external_link: ![null, undefined].includes(row[item.key]) && row[item.key] != '' ? row[item.key].external_link : null,
                            value: [null, undefined].includes(row[item.key]) ? null : typeof row[item.key] == 'object' ? String(row[item.key].value) : String(row[item.key]),
                        }"
                        :disabled="false"
                        :isUseEnter="false"
                        :mask="item.mask"
                        :isLink="Boolean(item.is_external_link)"
                        :isReadOnly="Boolean(item.read_only || !row.isEdit)"
                        @changeValue="(data) => changeValue(row.id, data)"
                    />
                    <FormItem 
                        v-else-if="item.type == 'json'"
                        class="form-item__value" 
                        :required="Boolean(item.required)"
                    >
                        <FormLabel
                            v-show="item.title != null && item.title != ''"
                            :title="item.title"
                        />

                        <FormValue 
                            :isHTML="true"
                            :value="row[item.key]"
                            :isLink="Boolean(item.is_external_link)"
                            :link="typeof row[item.key] == 'object' && row[item.key] != null ? row[item.key].external_link : null"
                        />
                    </FormItem>
                    <AppActions 
                        v-else-if="item.type == 'actions'"
                        :item="{
                            title: 'Действие',
                            slug: row.isEdit ? 'edit' : 'view'
                        }"
                        :disabled="!row.isChoose && actionState == 'saving'"
                        @callAction="(data) => callAction({action: data.value, value: row})"
                    />
                    <AppStatus 
                        v-else-if="item.type == 'status'"
                        :item="{
                            focus: false,
                            id: row.id,
                            key: item.key,
                            title: item.title,
                            options: item.options,
                            value: row[item.key],
                            required: Boolean(item.required),
                        }"
                        :isCanCreate="false"
                        :isHaveNullOption="false"
                        :isReadOnly="Boolean(item.read_only || !row.isEdit)"
                        @changeValue="(data) => changeValue(row.id, data)"
                    />
                    <AppSelect 
                        v-else-if="item.type == 'select_dropdown'"
                        :item="{
                            id: row.id,
                            key: item.key,
                            value: row[item.key],
                            focus: false,
                            required: Boolean(item.required),
                            title: item.title,
                            options: item.options,
                            lockedOptions: []
                        }"
                        :isReadOnly="Boolean(item.read_only || !row.isEdit)"
                        :isHaveNullOption="true"
                        :isMultiple="Boolean(item.is_plural)"
                        :isFiltered="true"
                        @changeValue="(data) => changeValue(row.id, data)"
                    />
                    <div v-else>
                        {{ item.type }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import './Mobile.scss';

    import { inject, ref } from 'vue'
    
    import FormItem from '@/components/AppForm/FormItem/FormItem.vue';
    import FormLabel from '@/components/AppForm/FormLabel/FormLabel.vue';
    import AppActions from '@/components/AppTable/Body/Actions/Actions.vue'
    import AppStatus from '@/components/AppSelects/Status/Status.vue'
    import AppSelect from '@/components/AppSelects/Select/Select.vue'
    import FormValue from '@/components/AppForm/FormValue/FormValue.vue'
    import AppCheckbox from "@/components/AppInputs/Checkbox/Checkbox.vue"
    import AppTextarea from "@/components/AppInputs/Textarea/Textarea.vue"
    import AppRelation from "@/components/AppSelects/Relation/Relation.vue"

    const fields = inject('fields')
    const bodyData = inject('bodyData')
    const actionState = inject('actionState')
    const backupValues = inject('backupValues')

    let clickSetting = ref({
        id: -1,
        delay: 500,
        clicks: 0,
        timer: null
    })

    const props = defineProps({
        slug: {
            default: null,
            type: String
        },
        isTrash: {
            default: false,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'callAction'
    ])

    // Изменение значения в поле
    const changeValue = (id, data) => {
        let findedRow = bodyData.value.find(row => row.id == id)
        findedRow[data.key] = data.value

        if (data.key == 'isChoose') {
            if (data.value) {
                actionState.value = props.isTrash ? 'restoring' : 'editting'
            } else if (bodyData.value.filter(p => p.isChoose).length == 0) {
                actionState.value = null
            }
        }
    }

    // Симуляция двойного клика
    const doubleClick = (event, row, item) => {
        clickSetting.value.clicks++;
        if (clickSetting.value.clicks === 1) {
            clickSetting.value.timer = setTimeout( () => {
            clickSetting.value.clicks = 0
            }, clickSetting.value.delay);
        } else {
            if (!row.isEdit && item.key != 'actions') {
                callAction({action: 'showModal', value: row.id})
            }
            window.getSelection().empty();
            clearTimeout(clickSetting.value.timer);  
            clickSetting.value.clicks = 0;
        }   
        clickSetting.value.id = item.id
    }

    // Вызов действия в ячейке
    const callAction = (data) => {
        // Открытие ссылок
        const openLink = (value) => {
            emit('callAction', {
                action: 'showModal',
                value: {
                    id: value.id,
                    slug: value.slug,
                    tab: [null, undefined].includes(value.tab) ? null : value.tab
                }
            })
        }
       
        // Редактирование строки
        const editRow = (value) => {
            let findedIndex = bodyData.value.findIndex(row => row.id == value.id)
            backupValues.value.push(JSON.parse(JSON.stringify(bodyData.value[findedIndex])))
            bodyData.value[findedIndex].isEdit = true
            bodyData.value[findedIndex].isChoose = true
            actionState.value = 'saving'
        }

        switch (data.action) {
            // Открытие модального окна
            case 'showModal':
                openLink({
                    id: data.value,
                    slug: props.slug,
                    tab: null
                })
                break;

            // Редактирование строки
            case 'edit':
                editRow(data.value)
                break;

            // Открытие ссылки
            case 'openLink':
                openLink(data.value)
                break;

            default:
                emit('callAction', {action: data.action, value: data.value})
                break;
        }
    }
</script>
