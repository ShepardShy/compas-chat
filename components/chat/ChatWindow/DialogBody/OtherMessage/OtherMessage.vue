<script setup lang="ts">

import type { GroupChatMessageType, MessageType, UserChatType } from '~/types/messages'
import { useChatsStore } from '~/store/chats'
import { useSettingsStore } from '~/store/settings'

/**
 * Входящие пропсы
 */
interface PropsType {
  message: GroupChatMessageType | MessageType
  lastOfSeveralMsgs: boolean
}
const props = defineProps<PropsType>()
const { message, lastOfSeveralMsgs } = toRefs(props)

/**
 * Подклбчение стора с чатами
 */
const chatsStore = useChatsStore()
const { chats } = storeToRefs(chatsStore)
/**
 * Подклбчение стора с настройками
 */
const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

/***
 * Получение данных о о=пользователе открытого чата
 */
const chatUser = computed<UserChatType>(() => chats.value.find(chat => chat.userId === message.value.userId))

/***
 * Фото пользователя или если его нет заливка гралиентом
 */
const chatPhoto = computed<string>(() => {
  if (!lastOfSeveralMsgs.value) return 'none'

  if (chatUser.value.photo) {
    return `url(${chatUser.value.photo})`
  } else {
    return 'linear-gradient(to bottom, #71d2fc 2%, #9490ff 100%)'
  }
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
    class="other-msg"
    :class="{
      'other-msg_mobile': isMobileSize,
    }"
  >
    <div
      class="other-msg__photo"
      :class="{
        'other-msg__photo_mobile': isMobileSize
      }"
      :style="{
        backgroundImage: chatPhoto
      }"
    >
      <div
        v-if="!chatUser.photo"
        class="other-msg__first-name-letter"
      >
        {{ chatUser?.firstName ? chatUser?.firstName[0] : '' }}
      </div>
    </div>

    <div
      class="other-msg__body"
      :class="{
        'other-msg__triangle ': lastOfSeveralMsgs
      }"
    >
      <div class="other-msg__message">
        {{ message.message }}
      </div>

      <div class="other-msg__time-and-status">
        <div class="other-msg__time">
          {{ messageTime() }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'OtherMessage';
</style>
