<template>
    <AppSection 
        ref="sectionRef" 
        class="section__table table-template" 
        :style="`--stickyTop: ${scrollPosition}px`" 
        :class="props.table.loaderState == 'loading' ? 'table-template_loading' : props.table.loaderState == 'filtering' ? 'table-template_filtering' : ''"
    >
        <TableTop 
            v-if="fields.length > 0"
            @callAction="(data) => callAction(data)"
        />
 
        <TableSocket 
            v-show="socketRows.header.length > 0 || socketRows.body.length > 0"
            :socketRows="socketRows"
            @callAction="(data) => callAction(data)"
        />

        <TableMobile 
            v-if="isMobile"
            :slug="props.slug"
            :isTrash="props.isTrash"
            @callAction="(data) => callAction(data)"
        />
        
        <div v-else class="table-template__body section__scroll-area">
            <table class="table" ref="tableRef" :class="fields.length == 0 || bodyData.length == 0 ? 'table_empty' : ''">
                <TableHeader 
                    :isTrash="props.isTrash"
                />
                <TableBody 
                    :slug="props.slug"
                    :isTrash="props.isTrash"
                    @callAction="(data) => callAction(data)"
                />
            </table>
            <ScrollButtons />
        </div>

        <TableFooter 
            @callAction="(data) => callAction(data)"
        />

        <SectionActions 
            :actionState="actionState"
            @callAction="(data) => callAction(data)"
        />

        <TableWarning 
            @callAction="(data) => callAction(data)"
        />
    </AppSection>
</template>

<script setup>
    import './AppTable.scss';
    
    import { ref, onMounted, provide, watch } from 'vue'

    import _ from 'lodash'
    import TableTop from './Top/Top.vue'
    import TableBody from './Body/Body.vue'
    import ValidateField from './Validate.js'
    import TableHeader from './Header/Header.vue'
    import TableFooter from './Footer/Footer.vue'
    import TableSocket from './Socket/Socket.vue'
    import TableMobile from './Mobile/Mobile.vue'
    import TableWarning from './Warning/Warning.vue';
    import ScrollButtons from './ScrollButtons/ScrollButtons.vue';
    import AppSection from '@/components/AppSection/AppSection.vue';
    import SectionActions from '@/components/AppSection/Actions/Actions.vue';

    let fields = ref([])
    let bodyData = ref([])
    let footerData = ref({})
    let actionState = ref(null)
    let backupValues = ref([])
    let socketRows = ref({
        header: [],
        body: []
    })

    const tableRef = ref(null)
    const sectionRef = ref(null)

    let isMobile = ref(false)
    let updatedRows = ref([])
    let invalidRows = ref([])
    let selectAll = ref(false)
    let scrollPosition = ref(0)
    let sortItem = ref({
        key: 'id',
        order: 'asc'
    }) 

    let isShow = ref({
        state: false,
        type: null
    })

    let menu = ref({
        tabs: [
            {
                tab: 'enabled',
                title: 'Отображение столбцов',
            },
            {
                tab: 'fixed',
                title: 'Фиксирование столбцов',
            },
            {
                tab: 'order',
                title: 'Порядок столбцов',
            }
        ],
        saves: {
            isShow: false,
            activeTab: null,
            tabs: [
                {
                    tab: 'myself',
                    key: 'myself',
                    title: 'Применить для себя',
                },
                {
                    tab: 'roles',
                    key: 'roles',
                    title: 'Применить для роли',
                },
                {
                    tab: 'all',
                    key: 'all',
                    title: 'Применить для всех',
                }
            ],
            options: [
                {
                    id: 0,
                    sort: 0,
                    key: 'key_11',
                    title: 'Role 3.1',
                    enabled: true
                },
                {
                    id: 1,
                    sort: 0,
                    key: 'key_21',
                    title: 'Role 3.2',
                    enabled: false
                },
                {
                    id: 2,
                    sort: 0,
                    key: 'key_31',
                    title: 'Role 3.3',
                    enabled: false
                }
            ],
        },
        activeTab: null
    })

    const props = defineProps({
        table: {
            default: {
                tableKeys: [],
                tableData: [],
                tableFooter: {
                    pages: 0,
                    activePage: 0,
                    count: 25
                },
                loaderState: null
            },
            type: Object
        },
        isTrash: {
            default: false,
            type: Boolean
        },
        slug: {
            default: 'undefined',
            type: String
        }
    })

    const emit = defineEmits([
        'callAction'
    ])

    provide('menu', menu)
    provide('fields', fields)
    provide('isShow', isShow)
    provide('sortItem', sortItem)
    provide('tableRef', tableRef)
    provide('bodyData', bodyData)
    provide('selectAll', selectAll)
    provide('sectionRef', sectionRef)
    provide('footerData', footerData)
    provide('actionState', actionState)
    provide('invalidRows', invalidRows)
    provide('backupValues', backupValues)
    provide('scrollPosition', scrollPosition)
    
    onMounted(async () => {
        isMobile.value = window.innerWidth <= 660
        window.addEventListener('resize', checkingWindowWidth);
        footerData.value = JSON.parse(JSON.stringify(props.table.tableFooter))
        fields.value = callAction({action: 'setPropsValues', value: props.table.tableKeys})
        socketRows.value = {
            header: [
                {
                    "id": 842,
                    "title": "Клиент 222",
                }
            ],
            body: [
                {
                    id: 130301,
                    name: "Новый клиент",
                }
            ]
        }
        bodyData.value = callAction({action: 'setPropsValues', value: props.table.tableData})
    })

    // Проверка был ли уменьшен размер окна
    const checkingWindowWidth = _.throttle(() => {
        isMobile.value = window.innerWidth <= 660
    }, 100)

    // Вызов действия в таблице
    const callAction = (data) => {
        // Установка значений по умолчанию
        const setPropsValues = (data) => {
            if ([null, undefined].includes(data) || !Array.isArray(data)) {
                return []
            } else {
                return JSON.parse(JSON.stringify(data.filter(p => ![null, undefined].includes(p) && typeof p == 'object' && !Array.isArray(p))))
            }
        }

        // Редактирование строк
        const editRows = () => {
            actionState.value = 'saving'

            bodyData.value.forEach(row => {
                if (row.isChoose) {
                    backupValues.value.push(JSON.parse(JSON.stringify(row)))
                    row.isEdit = true
                }
            });
        }

        // Отмена редактирования полей
        const cancelRows = () => {
            let findedIndex = null
            for (let row of backupValues.value) {
                row.isChoose = false
                findedIndex = bodyData.value.findIndex(p => p.id == row.id)
                bodyData.value[findedIndex] = row
            }

            for (let row of bodyData.value) {
                row.isChoose = false
            }

            actionState.value = null
            selectAll.value = false
        }

        // Сохранение редактируемых полей
        const saveRows = () => {
            // Получение обновленных ключей
            const getUpdatedFields = (row, backupRow) => {
                let flag = false
                let updatedRow = {
                    id: row.id
                }

                for (let key in row) {
                    if (!['isEdit', 'isChoose'].includes(key) && !_.isEqual(row[key], backupRow[key])) {
                        flag = true
                        updatedRow[key] = row[key]
                    }
                }

                return flag == false ? null : updatedRow
            }

            // Валидация полей
            const validateFields = (row) => {
                let flag = false
                let error = null
                let fieldError = {}

                for (let field of fields.value) {
                    error = ValidateField(field, row[field.key])
                    
                    if (error.state) {
                        flag = true
                        fieldError.id = row.id
                        fieldError[field.key] = {
                            value: row[field.key],
                            error: error.text
                        }
                    }
                }

                if (flag) {
                    return fieldError
                } else {
                    return false
                }
            }

            // Проверка строк на валидацию
            const checkingRows = () => {
                for (let backupRow of backupValues.value) {
                findedIndex = bodyData.value.findIndex(p => p.id == backupRow.id)

                let error = validateFields(bodyData.value[findedIndex])

                if (!error) {
                    updatedRows.value.push(getUpdatedFields(bodyData.value[findedIndex], backupRow))
                } else {
                    invalidFlag = true
                    invalidRows.value.push(error)
                }
            }
            }

            // Инициализация сохранения строк
            const initSave = () => {
                if (invalidFlag) {
                    isShow.value = {
                        state: true,
                        type: 'validation'
                    }
                } else {
                    backupValues.value = []
                    actionState.value = null
                    selectAll.value = false
                    updatedRows.value = updatedRows.value.filter(p => p != null)

                    for (let row of bodyData.value) {
                        delete row.isEdit
                        row.isChoose = false
                    }


                    if (updatedRows.value.length == 0) {
                        return
                    } else {
                        emit('callAction', {
                            action: 'save',
                            value: updatedRows.value
                        })
                    }
                }
            }

            let findedIndex = null
            let invalidFlag = false 
            updatedRows.value = []
            invalidRows.value = []
            isShow.value = {
                state: false,
                type: null
            }

            checkingRows()
            initSave()
        }

        // Инициализация удаления строк таблицы
        const initDeleteRows = (value) => {
            let findedIndex = bodyData.value.findIndex(row => row.id == value.id)
            bodyData.value[findedIndex].isChoose = true

            isShow.value = {
                state: true,
                type: 'delete'
            }
        }

        // Удаление строк
        const deleteRows = (type = 'delete') => {
            let data = []

            for (let row of bodyData.value) {
                if (row.isChoose) {
                    data.push(row.id)
                    bodyData.value = bodyData.value.filter(p => p.id != row.id)
                }
            }

            selectAll.value = false
            isShow.value = {
                state: false,
                type: null
            }
            actionState.value = null

            if (type == 'delete') {
                emit('callAction', {action: 'delete', value: data})
            } else if (type == 'restore') {
                emit('callAction', {action: 'restore', value: data})
            }
        }

        // Инициализация восстановления строк 
        const initRestoreRows = () => {
            isShow.value = {
                state: true,
                type: 'restore'
            }
        }

        // Обновление таблицы с помощью сокетов
        const socketUpdate = () => {
            // Обновление тела таблицы
            const updateBody = () => {
                // Обновление значения поля
                const updateFieldValue = (row, updatedRow) => {
                    for (let key in updatedRow) {
                        row[key] = updatedRow[key]
                    }
                }

                // Установка статуса, что строка была обновлена
                const setUpdatedStatus = (id) => {
                    let findedIndex = bodyData.value.findIndex(row => row.id == id)
                    bodyData.value[findedIndex].isUpdated = true

                    setTimeout(() => {
                        let findedIndex = bodyData.value.findIndex(row => row.id == id)
                        delete bodyData.value[findedIndex].isUpdated
                    }, 3000);
                }

                for (let socketRow of socketRows.value.body) {
                    if (socketRow.isNew) {
                        bodyData.value.unshift(socketRow)
                        setUpdatedStatus(socketRow.id)
                    } else if (socketRow.isDeleted) {
                        bodyData.value = bodyData.value.filter(row => row.id != socketRow.id)
                    } else {
                        let findedIndex = bodyData.value.findIndex(row => row.id == socketRow.id)
                        updateFieldValue(bodyData.value[findedIndex], socketRow)
                        setUpdatedStatus(socketRow.id)
                    }
                    socketRows.value.body = socketRows.value.body.filter(row => row.id != socketRow.id)
                }
            }

            // Обновление шапки таблицы
            const updateHeader = () => {
                // Обновление значения поля
                const updateFieldValue = (column, updatedColumn) => {
                    for (let key in updatedColumn) {
                        column[key] = updatedColumn[key]
                    }
                }

                // Установка статуса, что строка была обновлена
                const setUpdatedStatus = (id) => {
                    let findedIndex = fields.value.findIndex(column => column.id == id)
                    fields.value[findedIndex].isUpdated = true

                    setTimeout(() => {
                        let findedIndex = fields.value.findIndex(column => column.id == id)
                        delete fields.value[findedIndex].isUpdated
                    }, 3000);
                }

                for (let socketColumn of socketRows.value.header) {
                    let findedIndex = fields.value.findIndex(column => column.id == socketColumn.id)

                    if (socketColumn.isNew) {
                            fields.value.unshift(socketColumn)
                    } else if (socketColumn.isDeleted) {
                            fields.value = fields.value.filter(column => column.id != socketColumn.id)
                    } else {
                        updateFieldValue(fields.value[findedIndex], socketColumn)
                        setUpdatedStatus(socketColumn.id)
                    }
                    socketRows.value.header = socketRows.value.header.filter(column => column.id != socketColumn.id)
                } 
            }

            updateBody()
            updateHeader()
        }

        // Получить данные таблицы
        const getTableData = () => {
            emit('callAction', {action: 'getTableData', value: {
                sortItem: sortItem.value,
                footerData: footerData.value
            }})
        }

        switch (data.action) {
            // Установка значений по умолчанию
            case 'setPropsValues':
                return setPropsValues(data.value)

            // Редактирование полей
            case 'edit':
                editRows()
                break;
        
            // Отмена редактирования полей
            case 'cancel':
                cancelRows()
                break;

            // Сохранение строк таблицы
            case 'save':
                saveRows()
                break;

            // Инициализация удаления строк таблицы
            case 'initDelete':
                initDeleteRows(data.value)
                break;

            // Удаление строк в таблице
            case 'delete':
                deleteRows('delete')
                break;

            // Восстановление строк
            case 'initRestore':
                initRestoreRows()
                break;

            // Восстановление строк
            case 'restore':
                deleteRows('restore')
                break;

            // Обновление таблицы с помощью сокетов
            case 'socketUpdate':
                socketUpdate()
                break;

            // Получение информации для тела таблицы
            case 'getTableData':
                getTableData()
                break;

            default:
                emit('callAction', data)
                break;
        }
    }

    watch(() => props.table.tableData, () => {
        footerData.value = JSON.parse(JSON.stringify(props.table.tableFooter))
        bodyData.value = callAction({action: 'setPropsValues', value: props.table.tableData})
    }, {
        deep: true
    })
</script>
