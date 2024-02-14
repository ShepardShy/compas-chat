<template>
    <div
        class="file-upload"
        :class="dragover ? 'file-upload_dragover' : ''"
    >
        <input
            type="file"
            class="file-upload__input"
            :multiple="props.isMultiple"
            :title="props.buttonTitle"
            @dragover="dragover = true"
            @dragenter="dragover = true"
            @dragleave="dragover = false"
            @change="(event) => addFiles(event)"
        >

        <div class="file-upload__button">
            <LoadFile />
            <span class="file-upload__button-title">
                {{ props.buttonTitle }}
            </span>
        </div>
    </div>
</template>

<script setup>
    import './FileUpload.scss';

    import {ref} from "vue";

    import LoadFile from "@/components/AppIcons/LoadFile/LoadFile.vue";
    import Input from "@/components/AppAutocomplete/Input/Input.vue";

    const props = defineProps({
        isMultiple: {
            default: false,
            type: Boolean
        },
        buttonTitle: {
            default: 'Загрузить',
            type: String
        }
    })

    const emit = defineEmits([
        'callAction'
    ])

    const dragover = ref(false)

    // Добавление файлов
    const addFiles = (event) => {
        dragover.value = false
        emit('callAction', { action: 'addFiles', value: event.target.files })
    }
</script>