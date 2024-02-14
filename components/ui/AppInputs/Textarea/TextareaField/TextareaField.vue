<template>
    <div class="textarea">
        <textarea
            type="text"
            ref="textareaRef"
            autocomplete="off"
            :disabled="props.disabled"
            :value="mirrorText"
            :placeholder="props.item.placeholder"
            :id="`input_${props.item.id}`"
            @input="(event) => changeValue(event.target.value)"
        > </textarea>

        <pre class="textarea__mirror">{{ mirrorText }}</pre>
    </div>
</template>

<script setup>
    import './TextareaField.scss';

    import { ref, onMounted, watch } from 'vue'

    let mirrorText = ref('');
    let textareaRef = ref(null);

    const emit = defineEmits([
        'changeValue',
    ])

    const props = defineProps({
        item: {
            default: {
                id: 0,
                key: '',
                value: '',
                type: "text",
                placeholder: '',
                title: "Undefined title"
            },
            type: Object
        },
        disabled: {
            default: false,
            type: Boolean
        },
        mask: {
            default: null,
            type: String
        },
        isUseEnter: {
            default: true,
            type: Boolean
        }
    })

    // Изменение значения
    const changeValue = (value) => {
        // Создание регулярного выражения из маски
        const createRegexpMask = (mask) => {
            let newReg = '^'
            mask = mask.replace(/[\s()\-+]/g, '')

            for (let symb of mask) {
                switch(symb) {
                    case '#': 
                        newReg += `[0-9]{1}`
                        break;
                    case 'A': 
                        newReg += `[а-яa-zА-ЯA-Z]{1}`
                        break;
                    default: 
                        if (Number(symb) != NaN) {
                            newReg += `[\\d]{1}`
                        }
                        break;
                }

            }
            newReg += '$'

            return new RegExp(newReg)
        }
    
        // Проверка на Enter
        const checkInputEnter = () => {
            return (/\n/i.test(value))
        }

        // Проверка по маске
        const checkInputMask = () => {
            let mask = null
            let regExp = null

            if (value.length > props.mask.length) {
                return false
            } else {
                mask = props.mask.replaceAll(' ', '').substring(0, value.length)
                regExp = createRegexpMask(mask)

                if (!regExp.test(value)) {
                    return false
                } else {
                    return true 
                }
            }
        }

        // Изменение значения
        const setValue = () => {
            if (!props.isUseEnter) {
                if (checkInputEnter()) {
                    textareaRef.value.value = mirrorText.value;
                    return
                }
            }


            if (props.mask != '' && ![undefined, null].includes(props.mask)) {
                if (checkInputMask()) {
                    mirrorText.value = value
                } else {
                    textareaRef.value.value = mirrorText.value;
                    return
                }
            } else {
                mirrorText.value = value
            }

            emit('changeValue', {
                key: props.item.key,
                value: value
            })
        }

        setValue()
        resize()
    }

    // Получить изначальное значение поля
    const getValue = () => {
        if (![null, undefined].includes(props.item.value)) {
            if (typeof props.item.value == 'object') {
                if (props.isUseEnter) {
                    return String(props.item.value.value).replaceAll('\n', '')
                } else {
                    return props.item.value.value
                }
            } else {
                if (props.isUseEnter) {
                    return String(props.item.value).replaceAll('\n', '')
                } else {
                    return props.item.value
                }
            }
        } else {
            return ''
        }
    }

    onMounted(() => {
        mirrorText.value = getValue()

        new ResizeObserver(resize).observe(textareaRef.value)

        if (props.item.focus) {
            textareaRef.value.focus()
        }
    })

    const resize = () => {
        if (textareaRef.value != null) {
            let textareaMirror = textareaRef.value.closest('.textarea').querySelector('.textarea__mirror');
            textareaMirror.style.height = "1px";
            textareaMirror.style.height = (6 + textareaRef.value.scrollHeight) + "px";
        }
    }

    watch(() => props.item.value, () => {
        mirrorText.value = getValue()
    })

    watch(() => props.item.focus, () => {
        if (props.item.focus) {
            textareaRef.value.focus()
        }
    })
</script>
