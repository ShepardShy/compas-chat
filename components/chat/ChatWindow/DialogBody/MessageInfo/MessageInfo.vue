<script setup lang="ts">
import type { MessageInfoType } from '~/types/messages'
import { useSettingsStore } from '~/store/settings'

/**
 * Входящие пропсы
 */
interface PropsType {
  message: MessageInfoType
  isNextMessageInfoMessage: boolean
}

const props = defineProps<PropsType>()
const { message } = storeToRefs(props)

/** Стор с настройками */

const settingStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingStore)
/**
 * Имена
 */
const messageNames = computed(() => {
  if (message.value.message.includes('создал')) {
    const messageArray = message.value.message.split(' ')
    const idx = messageArray.findIndex(i => i.includes('создал'))
    return messageArray.slice(0, idx).join(' ')
  }

  let messageWithoutText
  for (let i = 0; i < message.value.message.length; i++) {
    if (message.value.message[i] == ':') {
      messageWithoutText = message.value.message.slice(i + 1)
      break
    }
  }
  return messageWithoutText.split(', ')
})
/**
 * Сообщение
 */
const messageText = computed(() => {
  if (message.value.message.includes('создал')) {
    const messageArray = message.value.message.split(' ')
    const idx = messageArray.findIndex(i => i.includes('создал'))
    return messageArray.slice(idx).join(' ')
  }

  let messageWithText
  for (let i = 0; i < message.value.message.length; i++) {
    if (message.value.message[i] == ':') {
      messageWithText = message.value.message.slice(0, i + 1)
      break
    }
  }
  return messageWithText
})
/**
 * Является ли сообщение о создании чата
 */
const isMessageAboutChatCreating = computed(() => {
  return message.value.message.includes('создал')
})
</script>

<template>
  <div
    class="message-info"
    :style="{
      marginBottom: isNextMessageInfoMessage ? '35px' : '5px',
      marginLeft: isMobileSize ? '0' : '25px'
    }"
  >
    <div
      class="message-info__data"
      :style="{
        flexDirection: isMessageAboutChatCreating ? 'row-reverse' : 'row'
      }"
    >
      <div class="message-info__text">
        {{ messageText }}
      </div>
      <div>
        <span
          v-if="!Array.isArray(messageNames)"
          class="message-info__user"
        >
          {{ messageNames }}
        </span>
        <span v-else>
          <span
            v-for="(user, idx) in messageNames"
            :key="user.userId"
            class="message-info__user"
          >
            {{ idx !== messageNames.length - 1 ? user + ', ' : user }}
          </span>
        </span>
      </div>
    </div>
    <div class="message-info__date">
      {{ message.date.slice(-5) }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'MessageInfo';
</style>
