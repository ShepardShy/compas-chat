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
  const maxLength = isMobileSize.value ? 24 : 42

  if (fileData.fileName.length > maxLength) {
    return fileData.fileName.slice(0, (maxLength - 3) / 2) + '...' + fileData.fileName.slice(-(maxLength - 3) / 2)
  } else {
    return fileData.fileName
  }
}
</script>

<template>
  <div class="file-messages">
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
          <div class="file-message__open">
            Открыть с помощью
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
@use '~/assets/styles/_variables.scss' as variables;

.file-messages {
  padding: 10px 15px;
  max-width: 431px;
}

.file-messages__wrapper {
  margin-bottom: 5px;
}

.file-message {
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.file-messages__image {
  flex: 0 0 64px;
  height: 64px;
}

.file-message__info {
  padding: 2px 0;
}

.file-message__title {
  font-size: 16px;
  font-weight: 600;
  color: variables.$color-black;
  margin-bottom: 5px;
}

.file-message__time-size {
  display: flex;
  gap: 5px;
  font-size: 12px;
  font-weight: 400;
  color: #8babd8;
  margin-bottom: 5px;
}

.file-message__open {
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: variables.$color-active;
  transition: 0.2s all;
  text-decoration: underline;
}

.file-message__open:hover {
  text-decoration: none;
}

.file-messages__comment {
  font-size: 16px;
  font-weight: 400;
  color: variables.$color-black;
  margin-bottom: 5px;
}

.file-messages__time-status {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: flex-end;
}

.file-messages__time {
  font-size: 12px;
  font-weight: 400;
  color: #8f8f8f;
}
</style>
