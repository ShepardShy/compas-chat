<script setup lang="ts">
import type { GroupChatMessageType, ImageMessageType, MessageType } from '~/types/messages'
import ViewedMessageIcon from 'assets/icons/viewed-message-icon.svg'
import ReceivedMessageIcon from 'assets/icons/recieved-message-icon.svg'
import { useSettingsStore } from '~/store/settings'

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
 * Подключение стора с настройками
 */
const settingsStore = useSettingsStore()
const { isMobileSize } = toRefs(settingsStore)

/**
 * Количество колонок для отображения картинок
 */
const gridColumn = computed(() => {
  if (isMobileSize.value) {
    if (message.value?.images?.length <= 2) {
      return `repeat( ${message.value?.images?.length}, 1fr)`
    }

    return 'repeat( 2, 1fr)'
  }

  if (message.value?.images?.length < 3) {
    return `repeat( ${message.value?.images?.length}, 1fr)`
  }

  return 'repeat( 3, 1fr)'
})

/**
 * Высота картинки
 */
const gridRows = computed(() => {
  if (isMobileSize.value) {
    if (message.value?.images?.length <= 2) {
      return '285px'
    }

    const maxImagesPerLine = 2
    const gap = 5
    const imagesLength = message.value?.images?.length <= 4 ? message.value?.images?.length : 4

    const rowsQuantity = Math.ceil(imagesLength / maxImagesPerLine)

    return `calc(${100 / rowsQuantity}% - ${gap * (rowsQuantity - 2)}px)`
  }

  if (message.value?.images?.length <= 3) {
    return '323px'
  }

  const maxImagesPerLine = 3
  const gap = 5
  const imagesLength = message.value?.images?.length <= 9 ? message.value?.images?.length : 9

  const rowsQuantity = Math.ceil(imagesLength / maxImagesPerLine)

  return `calc(${100 / rowsQuantity}% - ${gap * (rowsQuantity - 2)}px)`
})
/**
 * Есть ли скрытые картинки
 */
const isImagesMoreThenShown = computed(() =>
  (isMobileSize && message.value.images?.length > 4) ||
    (!isMobileSize && message.value.images?.length > 9))
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
 * Картинки для отображения
 */
const maxImagesToShow = computed(() => {
  if (isMobileSize.value) {
    return message.value.images?.slice(0, 4)
  }

  return message.value.images?.slice(0, 9)
})
/**
 * Скрытые картинки
 */
const hideImagesLength = computed(() => message.value.images?.length - maxImagesToShow.value?.length)

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
  <div
    class="image-message"
    :class="{
      'image-message_mobile': isMobileSize
    }"
  >
    <div
      class="image-message__images"
      :style="{
        gridTemplateColumns: gridColumn,
        gridTemplateRows: gridRows,
        gridAutoRows: gridRows,
        height: isMobileSize ? '285px': '323px',
        borderRadius: message.comment ? '10px 10px 0 0' : '10px'
      }"
    >
      <div
        v-for="(image, idx) in maxImagesToShow"
        :key="image"
        class="image-message__image"
        :class="{
          'image-message__hide-images_last': isImagesMoreThenShown && (isMobileSize ? idx === 3 : idx === 8),
        }"
      >
        <img :src="image.url">
        <div
          v-if="!(isImagesMoreThenShown && (isMobileSize ? idx === 3 : idx === 8))"
          class="image-message__info"
        >
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

        <div
          v-else
          class="image-message__hide-images-length"
          :style="{
            top: isImagesMoreThenShown && isMobileSize && '30%'
          }"
        >
          {{ `+${hideImagesLength}` }}
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
          {{ messageTime() }}
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
