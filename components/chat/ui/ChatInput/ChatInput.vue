<script setup lang="ts">
import AddDocuments from 'assets/icons/add-doc-icon.svg'
import { docTypes, imagesTypes, inputFilesTypes } from '~/shared/const'
import { LoadedDocuments, LoadedImages } from '~/components'

/**
 * Входящие пропсы
 */
interface PropsType {
  placeholder?: string
  addDocuments?: boolean
  inputValue: string | undefined
  width?: string
  isMakingAVoiceMessage?: boolean
  messageDuration?: number
  isHeightResize?: boolean
  loadedImages?: Array<unknown>
  loadedDocuments?: Array<unknown>
}
const props = defineProps<PropsType>()
const {
  placeholder,
  addDocuments,
  inputValue,
  width,
  isMakingAVoiceMessage,
  messageDuration,
  isHeightResize,
  loadedImages,
  loadedDocuments
} = toRefs(props)

/**
 * События
 */
const emit = defineEmits<{
  (emit: 'update:inputValue', inputValue: string): void
  (emit: 'update:loadedImages', loadedImages: Array<unknown>): void
  (emit: 'update:loadedDocuments', loadedDocuments: Array<unknown>): void
}>()

/**
 * Открыто ли меню для подгрузки файлов
 */
const isFilesTypesMenuOpen = ref<boolean>(false)
/**
 * Выбранный тип файлов для загрузки
 */
const activeFileType = ref()
/**
 * Загружеггые изображения
 */
const uploadedImages = ref([])
/**
 * Загруженные документы
 */
const uploadedDocuments = ref([])

/**
 * Задает тип документов инпута при загрузке
 */
const documentsType = computed(() => {
  if (activeFileType.value == 'Фото') {
    return imagesTypes.join(',')
  }
  if (activeFileType.value == 'Файл') {
    return docTypes.join(',')
  }
})
/**
 * Определение placeholder для инпута
 */
const placeholderValue = computed(() => {
  if (isMakingAVoiceMessage.value) {
    return 'Для отмены кликните курсором вне поля'
  } else {
    return placeholder.value
  }
})
/**
 * Преобразование длины голосового сообщения
 */
const voiceMessageLengthTransformer = computed(() => {
  if (!messageDuration.value) {
    return '00:00:00'
  }

  const oneMinuteInSeconds = 60
  const oneHourInSeconds = 60 * 60

  const messageDurationSeconds = messageDuration.value.toFixed(0)

  const hours = Math.floor(messageDurationSeconds / oneHourInSeconds)
  const minutes = Math.floor((messageDurationSeconds - hours * oneHourInSeconds) / oneMinuteInSeconds)
  const seconds = Math.floor(messageDurationSeconds % oneMinuteInSeconds)

  let finalDuration = ''

  function addTime (time: number, isSeconds: boolean = false) {
    if (time < 10) {
      finalDuration += '0' + time
    } else {
      finalDuration += time
    }

    !isSeconds && (finalDuration += ':')
  }

  addTime(hours)
  addTime(minutes)
  addTime(seconds, true)

  return finalDuration
})

/**
 * Подписка на загрузку изображений и документов
 */
watch(
  () => [uploadedImages.value, uploadedDocuments.value],
  () => {
    emit('update:loadedImages', uploadedImages.value)
    emit('update:loadedDocuments', uploadedDocuments.value)
  },
  {
    deep: true
  }
)

/**
 * Монтирование компонента
 */
onMounted(() => {
  uploadedImages.value = loadedImages.value
  uploadedDocuments.value = loadedDocuments.value
})

/**
 * Загрузка файлов
 */
const $uploadDocuments = ref<HTMLInputElement>()
const filesData = ref()

// Открыть/закрыть меню выбора типа загружаемых файлов
const toggleFilesMenuType = () => isFilesTypesMenuOpen.value = !isFilesTypesMenuOpen.value

// Задать активнй тип файла и открыть меню для выбора файлов
const setActiveFileType = async (fileType: typeof inputFilesTypes) => {
  activeFileType.value = fileType
  toggleFilesMenuType()
  await nextTick()
  $uploadDocuments.value.click()
}

// Загрузка файлов
const onChangeChooseFiles = (_event: unknown) => {
  const _files = _event.target.files

  for (let i = 0; i < _files.length; i++) {
    const _file = _files[i]
    const _imageUrl = URL.createObjectURL(_file)
    const _fileName = _files[i].name

    if (_file.type.includes('image')) {
      uploadedImages.value = [
        ...uploadedImages.value,
        {
          id: i,
          url: _imageUrl,
          name: _fileName
        }]
    } else {
      uploadedDocuments.value = [
        ...uploadedDocuments.value,
        {
          id: i,
          url: _imageUrl,
          name: _fileName
        }]
    }
  }
}

/**
 * Управление высотой инпута
 */
const $inputBody = ref<HTMLInputElement>()
const $inputResizeIcon = ref<HTMLDivElement>()
let startPosition
let currentInputHeight = 40
const minHeight = 40
let isResizing = false

// Старт изменения высоты инпута
const startInputHeightResizing = (_event: MouseEvent) => {
  _event.preventDefault()
  isResizing = true

  $inputResizeIcon.value.style.cursor = 'grabbing'
  $inputBody.value.style.height = `${currentInputHeight}px`
  startPosition = $inputBody.value.getBoundingClientRect().top

  window.addEventListener('mousemove', keepInputHeightResizing)
  window.addEventListener('mouseup', stopInputHeightResizing)
}

// Изменение высоты инпута
const keepInputHeightResizing = (event: MouseEvent) => {
  if (!isResizing) return

  const currentMousePosition = event.pageY
  const windowHeight = window.innerHeight

  let newHeight
  if (startPosition > currentMousePosition) {
    newHeight = minHeight + startPosition - currentMousePosition
  } else {
    newHeight = currentInputHeight - (currentMousePosition - startPosition)
    startPosition = event.pageY
  }

  if (newHeight > windowHeight * 0.45) {
    $inputBody.value.style.height = `${windowHeight * 0.45}px`
    currentInputHeight = windowHeight * 0.45
  } else if (newHeight < minHeight) {
    $inputBody.value.style.height = `${minHeight}px`
    currentInputHeight = minHeight
  } else {
    $inputBody.value.style.height = `${newHeight}px`
    currentInputHeight = newHeight
  }
}

// Завершение изменение высоты инпута
const stopInputHeightResizing = () => {
  if (!isResizing) return

  $inputResizeIcon.value.style.cursor = 'grab'

  window.removeEventListener('mousemove', keepInputHeightResizing)
  window.removeEventListener('mouseup', stopInputHeightResizing)
}

/**
 * Задает border-radius для первого и последнего элемента меню выбора типо загружаемых документов
 * @param _itemIdx
 */
const setBorderRadiusForFirstAndLastItem = (_itemIdx) => {
  if (_itemIdx == 0) {
    return '5px 5px 0 0'
  } else if (inputFilesTypes.length - 1 == _itemIdx) {
    return '0 0 5px 5px'
  } else {
    return '0 0 0 0'
  }
}
</script>

<template>
  <div
    class="custom-input"
    :style="{
      width: width
    }"
  >
    <div
      v-if="uploadedImages?.length || uploadedDocuments?.length"
      class="files"
    >
      <LoadedDocuments
        v-if="uploadedDocuments.length"
        v-model:uploaded-documents="uploadedDocuments"
      />
      <LoadedImages
        v-if="uploadedImages?.length"
        v-model:uploaded-images="uploadedImages"
      />
    </div>

    <div
      class="input"
      :style="{
        width: width
      }"
    >
      <textarea
        ref="$inputBody"
        :value="inputValue"
        class="input__body"
        :class="{
          'input__body_document': addDocuments && !isMakingAVoiceMessage,
          'input__body_voice': isMakingAVoiceMessage
        }"
        :placeholder="placeholderValue"
        :style="{
          width: width,
          height: currentInputHeight + 'px'
        }"
        @input="$emit('update:inputValue', $event.currentTarget.value)"
      />

      <div
        v-if="isHeightResize"
        ref="$inputResizeIcon"
        class="input__resize-window"
        @mousedown.prevent="startInputHeightResizing($event)"
      >
        <div class="input__resize-window-line" />
        <div class="input__resize-window-line" />
      </div>

      <AddDocuments
        v-if="addDocuments && !isMakingAVoiceMessage"
        class="input__add-doc-icon"
        :class="{
          'input__add-doc-icon_active': isFilesTypesMenuOpen || filesData,
        }"
        @click="toggleFilesMenuType"
      />

      <div
        v-if="isMakingAVoiceMessage"
        class="input__voice-msg-circle"
      />

      <div
        v-if="isMakingAVoiceMessage"
        class="input__voice-msg-length"
      >
        {{ voiceMessageLengthTransformer }}
      </div>

      <input
        ref="$uploadDocuments"
        class="input__documents"
        type="file"
        multiple
        :accept="documentsType"
        @change="onChangeChooseFiles($event)"
      >

      <div
        v-if="isFilesTypesMenuOpen"
        class="doc__menu"
      >
        <div
          v-for="(fileType, idx) in inputFilesTypes"
          class="doc__item"
          :style="{
            borderRadius: setBorderRadiusForFirstAndLastItem(idx)
          }"
          @click="setActiveFileType(fileType)"
        >
          {{ fileType }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './ChatInput'
</style>
