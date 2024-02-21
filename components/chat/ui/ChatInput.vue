<script setup lang="ts">
import AddDocuments from '~/assets/icons/add-doc-icon.svg'
import {inputFilesTypes} from "~/shared/const";

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
const setActiveFileType = (fileType: typeof inputFilesTypes) => {
  activeFileType.value = fileType
  toggleFilesMenuType()
}

const setBorderRadiusForFirstAndLastItem = (itemIdx) => {
  if (itemIdx == 0) {
    return '5px 5px 0 0'
  } else if (inputFilesTypes.length - 1 == itemIdx) {
    return '0 0 5px 5px'
  }
}
</script>

<template>
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
</style>
