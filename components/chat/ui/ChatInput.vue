<script setup lang="ts">
import AddDocuments from '~/assets/icons/add-doc-icon.svg'
import DeleteIcon from '~/assets/icons/delete-icon.svg'
import { docTypes, imagesTypes, inputFilesTypes } from '~/shared/const'

interface PropsType {
  placeholder?: string
  addDocuments?: boolean
  inputValue: string | undefined
  width?: string
  isMakingAVoiceMessage?: boolean
  messageDuration?: number
}

const props = defineProps<PropsType>()
const { placeholder, addDocuments, inputValue, width, isMakingAVoiceMessage, messageDuration } = toRefs(props)

const emit = defineEmits<{
  (emit: 'update:inputValue', inputValue: string): void
}>()

const filesData = ref()
const isFilesTypesMenuOpen = ref<boolean>(false)
const activeFileType = ref()

const toggleFilesMenuType = () => isFilesTypesMenuOpen.value = !isFilesTypesMenuOpen.value
const setActiveFileType = async (fileType: typeof inputFilesTypes) => {
  activeFileType.value = fileType
  toggleFilesMenuType()
  await nextTick()
  $uploadDocuments.value.click()
}

const setBorderRadiusForFirstAndLastItem = (itemIdx) => {
  if (itemIdx == 0) {
    return '5px 5px 0 0'
  } else if (inputFilesTypes.length - 1 == itemIdx) {
    return '0 0 5px 5px'
  }
}

const documentsType = computed(() => {
  if (activeFileType.value == 'Фото') {
    return imagesTypes.join(',')
  }
  if (activeFileType.value == 'Файл') {
    return docTypes.join(',')
  }
})

const $uploadDocuments = ref<HTMLInputElement>()
const uploadedImages = ref([])
const uploadedDocuments = ref([])

const onChangeChooseFiles = (event: unknown) => {
  const files = event.target.files

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const imageUrl = URL.createObjectURL(file)
    const fileName = files[i].name

    if (file.type.includes('image')) {
      uploadedImages.value = [
        ...uploadedImages.value,
        {
          id: i,
          url: imageUrl
        }]
    } else {
      uploadedDocuments.value = [
        ...uploadedDocuments.value,
        {
          id: i,
          url: imageUrl,
          name: fileName
        }]
    }
  }
}

const deleteImage = (imgUrl: string) => {
  uploadedImages.value = [...uploadedImages.value].filter(image => image.url !== imgUrl)
}

const deleteDocument = (documentUrl: string) => {
  uploadedDocuments.value = [...uploadedDocuments.value].filter(document => document.url !== documentUrl)
}

const placeholderValue = computed(() => {
  if (isMakingAVoiceMessage.value) {
    return 'Для отмены кликните курсором вне поля'
  } else {
    return placeholder.value
  }
})

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
</script>

<template>
  <div
    class="custom-input"
  >
    <div
      v-if="uploadedImages.length || uploadedDocuments.length"
      class="files"
    >
      <div
        v-if="uploadedImages.length"
        class="files__images"
      >
        <div
          v-for="image in uploadedImages"
          :key="image.id"
          class="files__image-wrapper"
        >
          <div
            class="files__delete"
            @click="deleteImage(image.url)"
          >
            <DeleteIcon class="files__delete-icon" />
          </div>
          <img
            :src="image.url"
            class="files__image"
          >
        </div>
      </div>

      <div
        v-if="uploadedDocuments.length"
        class="files__documents"
      >
        <div
          v-for="document in uploadedDocuments"
          :key="document.id"
          class="files__document-wrapper"
        >
          <div
            class="files__delete"
            @click="deleteDocument(document.url)"
          >
            <DeleteIcon class="files__delete-icon" />
          </div>

          <div class="files__document">
            {{ document.name }}
          </div>
        </div>
      </div>
    </div>

    <div
      class="input"
      :style="{
        width: width
      }"
    >
      <input
        :value="inputValue"
        class="input__body"
        :class="{
          'input__body_document': addDocuments && !isMakingAVoiceMessage,
          'input__body_voice': isMakingAVoiceMessage
        }"
        :placeholder="placeholderValue"
        :style="{
          width: width,
        }"
        @input="$emit('update:inputValue', $event.currentTarget.value)"
      >
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
@use '~/assets/styles/_variables.scss' as variables;

.input {
  position: relative;
}

.files {
  margin-bottom: 20px;
}

.input__body {
  font-size: 14px;
  font-weight: 400;

  &::placeholder {
    color: variables.$color-dark-grey;
  }
}

.input__body_document {
  padding-left: 48px;
}

.input__body_voice::placeholder {
  text-align: center;
}

.input__add-doc-icon,
.input__voice-msg-length,
.input__voice-msg-circle {
  position: absolute;
  top: 14px;
  left: 15px;
  color: #A6B7D4;
  cursor: pointer;
}

.input__voice-msg-length {
  color: variables.$color-black;
  left: 42px;
  top: 12px;
}

.input__voice-msg-circle {
  width: 12px;
  height: 12px;
  margin: 1px 15px 3px 0;
  border-radius: 12px;
  box-shadow: 0 0 5px 0 rgba(199, 73, 35, 0.5);
  background-color: #c74923;
}

.input__add-doc-icon_active {
  color: #1253a2;
}

.input__documents {
  display: none;
}

.doc__menu {
  position: absolute;
  left: 15px;
  top: -55px;
  border-radius: 5px;
  box-shadow: 0 0 3px 0 variables.$color-black;
  background-color: #fff;
}

.doc__item {
  cursor: pointer;
  width: 179px;
  padding: 7px 10px;
}

.doc__item:hover,
.doc__item_active {
  background-color: variables.$color-light-grey;
}

.files__images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.files__image-wrapper {
  flex: 0 0 auto;
  border: 1px solid variables.$color-light-grey;
  border-radius: 5px;
  position: relative;
  padding: 4px;
  background-color: variables.$color-white;
}

.files__delete {
  position: absolute;
  top: -10px;
  right: -5px;
  width: 25px;
  height: 25px;
  border-radius: 5px;
  background-color: variables.$color-white;
  box-shadow: 0 0 3px 0 variables.$color-black;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid variables.$color-light-grey;
  cursor: pointer;
  transition: 0.2s scale;
}

.files__delete-icon {
  color: variables.$color-red;
}

.files__delete:hover {
  scale: 1.1;
}

.files__image {
  object-fit: contain;
  width: 100%;
  height: 150px;
}

.files__documents {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.files__document-wrapper {
  min-height: 50px;
  flex: 0 1 calc(33% - 10px);
  border: 1px solid variables.$color-light-grey;
  border-radius: 5px;
  position: relative;
  padding: 15px 10px 10px;
  background-color: variables.$color-white;
}
</style>
