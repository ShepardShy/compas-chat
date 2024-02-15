<script setup lang="ts">
import AddDocuments from '~/assets/icons/add-doc-icon.svg'

interface PropsType {
  placeholder?: string
  addDocuments?: boolean
  searchUserValue: string | undefined
}

const props = defineProps<PropsType>()
const { placeholder, addDocuments, searchUserValue } = toRefs(props)

const emit = defineEmits<{
  (emit: 'update:searchUserValue', inputValue: string): void
}>()
</script>

<template>
  <div class="input">
    <input
      :value="searchUserValue"
      class="input__body"
      :placeholder="placeholder"
      @input="$emit('update:searchUserValue', $event.currentTarget.value)"
    >
    <AddDocuments
      v-if="addDocuments"
      class="input__add-doc-icon"
    />
  </div>
</template>

<style scoped>
@use '~/assets/styles/_variables.scss' as variables;

.input__body {
  font-family: MyriadPro;
  font-size: 14px;
  font-weight: 400;

  &::placeholder {
    color: variables .$color-dark-grey;
  }
}

</style>
