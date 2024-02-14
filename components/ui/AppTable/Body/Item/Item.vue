<template>
    <td 
        ref="itemRef" 
        class="table__item"
        :style="`--colorItem: ${props.item.color};`"
        :data-key="props.item.key" 
        :class="[
            props.item.fixed ? 'table__item_fixed' : '', 
            !props.item.enabled ? 'table__item_hidden' : '',
            props.item.isUpdated ? 'table__item_updated' : ''
        ]" 
        @click="(event) => doubleClick(event, props.row)" 
    >
        <div class="table-item__content">
                <AppCheckbox 
                    v-if="props.item.type == 'checkbox'"
                    :item="{
                        isHTML: false,
                        id: props.row.id,
                        key: props.item.key,
                        title: props.item.title,
                        value: props.row[props.item.key],
                        required: Boolean(props.item.required)
                    }"
                    :disabled="actionState == 'saving'"
                    @changeValue="(data) => changeValue(props.row.id, data)"
                    @clickOutside="() => callAction({action: 'openPopup', value: false})"
                />
                <AppRelation 
                    v-else-if="props.item.type == 'relation'"
                    :item="{
                        focus: false,
                        id: props.row.id,
                        placeholder: null,
                        key: props.item.key,
                        title: props.item.title,
                        value: props.row[props.item.key],
                        required: Boolean(props.item.required),
                        options: ['status', 'relation'].includes(props.item.type) ? props.item.options : null,
                        lockedOptions: props.item.choosed,
                    }"
                    :isCanCreate="true"
                    :isMultiple="Boolean(props.item.is_plural)"
                    :isReadOnly="Boolean(props.item.read_only || !props.row.isEdit)"
                    @click="() => callAction({action: 'openPopup', value: true})"
                    @changeValue="(data) => changeValue(props.row.id, data)"
                    @openLink="(data) => callAction({action: 'openLink', value: {id: data.id, slug: props.item.related_table}})"
                    @showAll="() => callAction({action: 'openLink', value: {id: props.row.id, slug: props.slug, tab: props.item.related_table}})"
                    @createOption="() => emit('callAction', {action: 'createOption', value: props.item.related_table})"
                    @clickOutside="() => callAction({action: 'openPopup', value: false})"
                />
                <AppTextarea 
                    v-else-if="['number', 'password', 'text'].includes(props.item.type)"
                    :item="{
                        focus: false,
                        id: props.row.id,
                        placeholder: null,
                        key: props.item.key,
                        type: props.item.type,
                        title: props.item.title,
                        substring: props.item.unit,
                        required: Boolean(props.item.required),
                        external_link: ![null, undefined].includes(props.row[props.item.key]) && props.row[props.item.key] != '' ? props.row[props.item.key].external_link : null,
                        value: [null, undefined].includes(props.row[props.item.key]) ? null : typeof props.row[props.item.key] == 'object' ? String(props.row[props.item.key].value) : String(props.row[props.item.key]),
                    }"
                    :disabled="false"
                    :isUseEnter="false"
                    :mask="props.item.mask"
                    :isLink="Boolean(props.item.is_external_link)"
                    :isReadOnly="Boolean(props.item.read_only || !props.row.isEdit)"
                    @changeValue="(data) => changeValue(props.row.id, data)"
                    @clickOutside="() => callAction({action: 'openPopup', value: false})"
                />
                <FormValue 
                    v-else-if="item.type == 'json'"
                    :isHTML="true"
                    :value="props.row[props.item.key]"
                    :isLink="Boolean(props.item.is_external_link)"
                    :link="typeof props.row[props.item.key] == 'object' && props.row[props.item.key] != null ? props.row[props.item.key].external_link : null"
                />
                <AppActions 
                    v-else-if="item.type == 'actions'"
                    :item="{
                        title: 'Действие',
                        slug: props.row.isEdit ? 'edit' : 'view'
                    }"
                    :disabled="!props.row.isChoose && actionState == 'saving'"
                    @clickOutside="() => callAction({action: 'openPopup', value: false})"
                    @callAction="(data) => callAction({action: data.value, value: row})"
                />
                <AppStatus 
                    v-else-if="props.item.type == 'status'"
                    :item="{
                        focus: false,
                        id: props.row.id,
                        key: props.item.key,
                        title: props.item.title,
                        options: props.item.options,
                        value: props.row[props.item.key],
                        required: Boolean(props.item.required),
                    }"
                    :isCanCreate="false"
                    :isHaveNullOption="false"
                    :isReadOnly="Boolean(props.item.read_only || !props.row.isEdit)"
                    @click="() => callAction({action: 'openPopup', value: true})"
                    @clickOutside="() => callAction({action: 'openPopup', value: false})"
                    @changeValue="(data) => changeValue(props.row.id, data)"
                />
                <AppSelect 
                    v-else-if="props.item.type == 'select_dropdown'"
                    :item="{
                        id: props.row.id,
                        key: props.item.key,
                        value: props.row[props.item.key],
                        focus: false,
                        required: Boolean(props.item.required),
                        title: props.item.title,
                        options: props.item.options,
                        lockedOptions: []
                    }"
                    :isReadOnly="Boolean(props.item.read_only || !props.row.isEdit)"
                    :isHaveNullOption="true"
                    :isMultiple="Boolean(props.item.is_plural)"
                    :isFiltered="true"
                    @click="() => callAction({action: 'openPopup', value: true})"
                    @clickOutside="() => callAction({action: 'openPopup', value: false})"
                    @changeValue="(data) => changeValue(props.row.id, data)"
                />
        </div>
    </td>
</template>

<script setup>
    import './Item.scss';
    
    import { inject, ref } from 'vue'

    import AppActions from '../Actions/Actions.vue'
    import AppStatus from '@/components/AppSelects/Status/Status.vue'
    import AppSelect from '@/components/AppSelects/Select/Select.vue'
    import FormValue from '@/components/AppForm/FormValue/FormValue.vue'
    import AppCheckbox from "@/components/AppInputs/Checkbox/Checkbox.vue"
    import AppTextarea from "@/components/AppInputs/Textarea/Textarea.vue"
    import AppRelation from "@/components/AppSelects/Relation/Relation.vue"

    const itemRef = ref(null)
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
        item: {
            default: {
                id: 2249,
                title: "Файл",
                key: "fail_2249",
                width: "325px",
                enabled: true,
                type: "file",
                is_plural: 0,
                external_link: 1,
                is_external_link: 0,
                is_link: 0,
                required: 0,
                fixed: false,
                index: 7,
                fixTarget: "0px",
                read_only: 0,
                unit: "",
                mask: "",
                can_edit: 0,
                color: "#000",
                is_hidden: 0,
                visible_always: 1,
                options: []
            },
            type: Object
        },
        row: {},
        isTrash: {
            default: false,
            type: Boolean
        },
        slug: {
            default: '',
            type: String
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
    const doubleClick = (event) => {
        clickSetting.value.clicks++;
        if (clickSetting.value.clicks === 1) {
            clickSetting.value.timer = setTimeout( () => {
            clickSetting.value.clicks = 0
            }, clickSetting.value.delay);
        } else {
            let regexp = /<\/?[a-z][\s\S]*>/i
            if (!props.row.isEdit && props.item.key != 'actions' && regexp.test(event.target.innerHTML)) {
                callAction({action: 'showModal', value: null})
            }
            window.getSelection().empty();
            clearTimeout(clickSetting.value.timer);  
            clickSetting.value.clicks = 0;
        }   
        clickSetting.value.id = props.item.id
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

        // Открытие попапа
        const openPopup = (state) => {
            if (state) {
                itemRef.value.closest('.table__item').classList.add('table__item_clicked')
            } else {
                itemRef.value.closest('.table__item').classList.remove('table__item_clicked')
            }
        }

        switch (data.action) {
            // Открытие модального окна
            case 'showModal':
                openLink({
                    id: props.row.id,
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

            // Открытие попапа
            case 'openPopup':
                openPopup(data.value)
                break;

            default:
                emit('callAction', {action: data.action, value: data.value})
                break;
        }
    }
</script>
