<script setup lang="ts">
import type { GroupChatMessageType, ImageMessageType, MessageType } from '~/types/messages'
import ViewedMessageIcon from 'assets/icons/viewed-message-icon.svg'
import ReceivedMessageIcon from 'assets/icons/recieved-message-icon.svg'

/**
 * Входящие пропсы
 */
interface PropsType {
  message: GroupChatMessageType | MessageType
  otherMessage: boolean
}

const props = defineProps<PropsType>()
const { message, otherMessage } = toRefs(props)

/**
 * Количество колонок для отображения картинок
 */
const gridColumn = computed(() => {
  if (message.value?.images?.length < 3) {
    return `repeat( ${message.value?.images?.length}, 1fr)`
  }

  return 'repeat( 3, 1fr)'
})

/**
 * Высота картинки
 */
const gridRows = computed(() => {
  if (message.value?.images?.length <= 3) {
    return '323px'
  }

  const maxImagesPerLine = 3
  const gap = 5

  const rowsQuantity = Math.ceil(message.value?.images?.length / maxImagesPerLine)

  return `calc(${100 / rowsQuantity}% - ${gap * (rowsQuantity - 1)}px)`
})
/**
 * Сообщение доставлено
 */
const isMessageReceived = computed<boolean>(() => {
  return message.value.isReceived &&
      !message.value.isViewed
})
/**
 * Сообщение просмотрено
 */
const isMessageViewed = computed<boolean>(() => {
  return message.value.isViewed
})

/**
 * Вывод времени сообщения
 */
const messageTime = (): string => {
  return message.value.date.slice(-5)
}

/**
 * Просмотрено ли изображение
 */
const isImageViewed = (_image: ImageMessageType) => {
  return _image.isViewed
}

/**
 * Получено ли изображение
 */
const isImageReceived = (_image: ImageMessageType) => {
  return _image.isReceived &&
      !_image.isViewed
}
</script>

<template>
  <div class="image-message">
    <div
      class="image-message__images"
      :style="{
        gridTemplateColumns: gridColumn,
        gridTemplateRows: gridRows,
        gridAutoRows: gridRows,
      }"
    >
      <div
        v-for="image in message.images"
        :key="image"
        class="image-message__image"
      >
        <img :src="image.url">
        <div class="image-message__info">
          <div class="image-message__time">
            {{ image.date.slice(-5) }}
          </div>
          <ViewedMessageIcon
            v-if="isImageViewed(image) && !otherMessage"
            style="color: #fff"
          />
          <ReceivedMessageIcon
            v-if="isImageReceived(image) && !otherMessage"
            style="color: #fff"
          />
        </div>
      </div>
    </div>
    <div
      v-if="message.comment"
      class="image-message__text"
      :style="{
        textAlign: otherMessage ? 'right': 'left'
      }"
    >
      {{ message.comment }}
      <div />
      <div
        v-if="message.comment"
        class="image-message__comment-info"
      >
        <div class="image-message__comment-data">
          {{ messageTime () }}
        </div>
        <ViewedMessageIcon
          v-if="isMessageViewed && !otherMessage"
          style="color: #27ae60"
        />
        <ReceivedMessageIcon
          v-if="isMessageReceived && !otherMessage"
          style="color: #27ae60"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './ImageMessage';
</style>
