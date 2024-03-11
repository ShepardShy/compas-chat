<script setup lang="ts">
import PdfDocIcon from '~/assets/icons/pdf-doc-icon.svg'
import WordDocIcon from '~/assets/icons/word-doc-icon.svg'
import AnyDocIcon from '~/assets/icons/any-doc-icon.svg'

/**
 * Входящие пропсы
 */
interface PropsType {
  uploadedDocuments: Array<unknown>
}

const props = defineProps<PropsType>()
const { uploadedDocuments } = toRefs(props)

/**
 * События
 */
const emit = defineEmits<{(emit: 'update:uploadedDocuments', documents: Array<unknown>): void }>()

/**
 * Удалить документ из загруженных
 */
const deleteDocument = (url: string) => {
  const updatedUploadedDocuments = [...uploadedDocuments.value].filter(document => document.url !== url)

  emit('update:uploadedDocuments', updatedUploadedDocuments)
}
</script>

<template>
  <div
    v-for="document in uploadedDocuments"
    :key="document.id"
    class="documents"
  >
    <div class="document__delete-and-icon">
      <div
        class="document__delete"
        @click="deleteDocument(document.url)"
      >
        <div class="document__delete-line" />
        <div class="document__delete-line" />
      </div>

      <PdfDocIcon
        v-if="document.name.slice(-3) === 'pdf'"
        class="document__icon"
      />
      <WordDocIcon
        v-else-if="document.name.slice(-4) === 'docx'"
        class="document__icon"
      />
      <AnyDocIcon
        v-else
        class="document__icon"
      />
    </div>

    <div class="document__title">
      {{ document.name }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './LoadedDocuments';
</style>
