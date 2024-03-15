<script setup lang="ts">

import ViewedMessageIcon from 'assets/icons/viewed-message-icon.svg'
import ReceivedMessageIcon from 'assets/icons/recieved-message-icon.svg'
import { useSettingsStore } from '~/store/settings'
import type { GroupChatMessageType, MessageType } from '~/types/messages'

/**
 * Входящие пропсы
 */
interface PropsType {
  message: GroupChatMessageType | MessageType
  otherMessage?: boolean
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
 * Вывод времени сообщения
 */
const messageTime = (): string => {
  return message.value.date.slice(-5)
}
</script>

<template>
  <div
    class="text-msg"
  >
    <div class="text-msg__message">
      {{ message.message }}
    </div>

    <div class="text-msg__time-and-status">
      <div class="text-msg__time">
        {{ messageTime() }}
      </div>
      <ViewedMessageIcon
        v-if="isMessageViewed && !otherMessage"
        style="color: #27AE60"
      />
      <ReceivedMessageIcon
        v-if="isMessageReceived && !otherMessage"
        style="color: #27AE60"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './TextMessage'
</style>
