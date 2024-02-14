<template>
    <FormItem 
        class="form-item__colorpicker colorpicker" 
        :required="false"
    >
        <div class="colorpicker_preview" :style="`--previewColor: ${props.color}`"></div>
        <ColorPicker 
            default-format="hex"
            :visible-formats="['hex']"
            :color="props.color"
            @color-change="(eventData) => $emit('changeColor', eventData)"
        />
        <AppButton class="colorpicker__button button_blue" @click="() => $emit('saveHiddenColor', props.color)">
            Сохранить
        </AppButton>
    </FormItem>
</template>

<script setup>
    import './ColorPicker.scss';
    
    import { ColorPicker } from 'vue-accessible-color-picker';
    import AppButton from "@/components/AppButton/AppButton.vue";
    import FormItem from '@/components/AppForm/FormItem/FormItem.vue';

    const props = defineProps({
        color: {
            default: '#000',
            type: String
        }
    })
</script>
