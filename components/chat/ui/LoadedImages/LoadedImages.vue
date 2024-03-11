<script setup lang="ts">

/**
 * Входящие пропсы
 */
interface PropsType {
  uploadedImages: Array<unknown>
}

const props = defineProps<PropsType>()
const { uploadedImages } = toRefs(props)

/**
 * События
 */
const emit = defineEmits<{(emit: 'update:uploadedImages', images: Array<unknown>): void }>()

/**
 * Удалить изображение из загруженных
 */
const deleteImage = (url: string) => {
  const updatedUploadedImages = [...uploadedImages.value].filter(image => image.url !== url)

  emit('update:uploadedImages', updatedUploadedImages)
}
</script>

<template>
  <div
    v-for="image in uploadedImages"
    :key="image.id"
    class="images"
  >
    <div
      class="images__delete-and-icon"
      :style="{
        backgroundImage: `url(${image.url})`
      }"
    >
      <div
        class="images__delete"
        @click="deleteImage(image.url)"
      >
        <div class="images__delete-line" />
        <div class="images__delete-line" />
      </div>
    </div>

    <div class="images__title">
      {{ image.name }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './LoadedImages';
</style>
