<script setup lang="ts">
import type { FileMessageType, GroupChatMessageType, MessageType } from '~/types/messages'
import { useSettingsStore } from '~/store/settings'
import ReceivedMessageIcon from 'assets/icons/recieved-message-icon.svg'
import ViewedMessageIcon from 'assets/icons/viewed-message-icon.svg'

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
const { isMobileSize } = storeToRefs(settingsStore)

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
 * Функция для определени картинки файла
 */
const imageUrl = (fileData: FileMessageType) => {
  // if (fileData.url) {
  //   return fileData.url
  // }

  const fileName = fileData.fileName
  if (fileName?.slice(-3) === 'xls' || fileName?.slice(-4) === 'xlsx') {
    return '/xls-doc-icon.svg'
  }

  if (fileName?.slice(-3) === 'doc' || fileName?.slice(-4) === 'docx') {
    return '/word-doc-icon.svg'
  }

  return '/any-doc-icon.svg'
}
/**
 * Заголовок файла
 */
const fileTitle = (fileData: FileMessageType) => {
  return fileData.fileName
  // const maxLength = isMobileSize.value ? 24 : 42
  //
  // if (fileData.fileName.length > maxLength) {
  //   return fileData.fileName.slice(0, (maxLength - 3) / 2) + '...' + fileData.fileName.slice(-(maxLength - 3) / 2)
  // } else {
  //   return fileData.fileName
  // }
}

/**
 * Скачать файл
 * @param fileData
 */
const downloadFile = (fileData: FileMessageType) => {
  const link = document.createElement('a')
  link.href = fileData.url
  link.download = fileData.fileName

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
}
</script>

<template>
  <div
    class="file-messages"
    :class="{
      'file-messages__mobile': isMobileSize
    }"
  >
    <div
      v-for="file in message.files"
      class="file-messages__wrapper"
    >
      <div class="file-message">
        <img
          :src="imageUrl(file)"
          alt="file preview"
          class="file-messages__image"
          :style="{
            scale: (file.fileName?.slice(-3) === 'xls' || file.fileName?.slice(-4) === 'xlsx') && '2'
          }"
        >
        <div class="file-message__info">
          <div class="file-message__title">
            {{ fileTitle(file) }}
          </div>
          <div class="file-message__time-size">
            <div class="file-message__time">
              {{ file.date.slice(-5) }}
            </div>
            <div class="file-message__size">
              {{ file.size }}
            </div>
          </div>
          <div
            class="file-message__open"
            @click="downloadFile(file)"
          >
            Скачать
          </div>
        </div>
      </div>
    </div>
    <div class="file-messages__comment-time">
      <div
        v-if="message.comment"
        class="file-messages__comment"
      >
        {{ message.comment }}
      </div>
      <div class="file-messages__time-status">
        <div class="file-messages__time">
          {{ message.date.slice(-5) }}
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
@import './FileMessage';
</style>
