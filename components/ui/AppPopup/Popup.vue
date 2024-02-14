<template>
    <details class="popup" ref="popupRef" 
        :class="props.isReadOnly ? 'popup_readonly' : ''"
        @mouseup="(event) => mouseDownEvent = null" 
        @mousedown="(event) => mouseDownEvent = event" 
        v-click-out-side="(event) => clickOutside(event)"
    >
        <summary class="popup__summary" @click="() => showDetail()">
            <slot name="summary"></slot>
        </summary>
        <div class="popup__content" @click="() => props.closeByClick ? popupScripts.hideDetails(popupRef) : ''">
            <slot name="content"></slot>
        </div>
    </details>
</template>

<script setup>
    import './Popup.scss';

    import { ref } from 'vue'
    import { clickOutSide as vClickOutSide } from '@mahdikhashan/vue3-click-outside'
    import popupScripts from './Scripts.js'

    const popupRef = ref(null)
    let mouseDownEvent = ref(null)

    const props = defineProps({
        closeByClick: {
            default: false,
            type: Boolean
        },
        isReadOnly: {
            default: false,
            type: Boolean
        },
        isHaveParent: {
            default: false,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'clickOutside',
    ])

    // Отслеживание вызова клика за пределами компонента
    const clickOutside = (event) => {
        if (mouseDownEvent.value == null || mouseDownEvent.value.target.closest('.popup') == null) {
            emit('clickOutside', event)
            popupScripts.hideDetails(popupRef.value)
        }
        mouseDownEvent.value = null
    }

    // Показать выплывающее меню
    const showDetail = () => {
        if (props.isHaveParent) {
            popupRef.value.setAttribute('open', true)
        }
        
        popupScripts.setDropdownPosition(popupRef.value)
    }

    defineExpose({
        popupRef
    })
</script>
