<script setup lang="ts">
import AddDocuments from '~/assets/icons/add-doc-icon.svg'
import {docTypes, imagesTypes, inputFilesTypes} from "~/shared/const";

interface PropsType {
  placeholder?: string
  addDocuments?: boolean
  inputValue: string | undefined
  width?: string
}

const props = defineProps<PropsType>()
const {placeholder, addDocuments, inputValue, width} = toRefs(props)

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
    return docTypes.join(',');
  }
});

const $uploadDocuments = ref<HTMLInputElement>()
const uploadedImages = ref([])

const onChangeChooseFiles = (event: unknown) => {
  const files = event.target.files

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const imageUrl = URL.createObjectURL(file)
    uploadedImages.value = [
      ...uploadedImages.value,
      {
        id: i,
        url: imageUrl,
      }]
  }
}
</script>

<template>
  <div
      class="files"
      v-if="uploadedImages.length"
  >
    <div
        class="files__images"
        v-if="uploadedImages.length">
        <div
            v-for="image in uploadedImages"
            :key="image.id"
            class="files__image"
        >
          <img :src="image.url" alt="Uploaded Image"/>
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
          :placeholder="placeholder"
          :style="{
        width: width,
        paddingLeft: addDocuments && '48px',
      }"
          @input="$emit('update:inputValue', $event.currentTarget.value)"
      >
      <AddDocuments
          v-if="addDocuments"
          class="input__add-doc-icon"
          :class="{
          'input__add-doc-icon_active': isFilesTypesMenuOpen || filesData,
        }"
          @click="toggleFilesMenuType"
      />

      <input
          class="input__documents"
          ref="$uploadDocuments"
          type="file"
          multiple
          :accept="documentsType"
          @change="onChangeChooseFiles($event)"
      />

      <div
          class="doc__menu"
          v-if="isFilesTypesMenuOpen"
      >
        <div
            v-for="(fileType, idx) in inputFilesTypes"
            class="doc__item"
            :class="{
            'doc__item_active': activeFileType === fileType
          }"
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

.input__body {
  font-size: 14px;
  font-weight: 400;

  &::placeholder {
    color: variables.$color-dark-grey;
  }
}

.input__add-doc-icon {
  position: absolute;
  top: 14px;
  left: 15px;
  color: #A6B7D4;
  cursor: pointer;
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
}

.files__image {
  
}
</style>
