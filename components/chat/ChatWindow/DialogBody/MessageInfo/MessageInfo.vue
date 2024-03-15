<script setup lang="ts">
import type { MessageInfoType } from '~/types/messages'

/**
 * Входящие пропсы
 */
interface PropsType {
  message: MessageInfoType
}

const props = defineProps<PropsType>()
const { message } = storeToRefs(props)

/**
 * Имена
 */
const messageNames = computed(() => {
  if (message.value.message.includes('создал')) {
    const messageArray = message.value.message.split(' ')
    const idx = messageArray.findIndex(i => i.includes('создал'))
    return messageArray.slice(0, idx).join(' ')
  }

  const messageArray = message.value.message.split(' ')
  const idx = messageArray.findIndex(i => i.includes('чат:'))
  return messageArray.slice(idx + 1).join(' ')
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

  const messageArray = message.value.message.split(' ')
  const idx = messageArray.findIndex(i => i.includes('чат:'))
  return messageArray.slice(0, idx + 1).join(' ')
})
/**
 *
 */
const isMessageAboutChatCreating = computed(() => {
  return message.value.message.includes('создал')
})
</script>

<template>
  <div
    class="message-info"
    :style="{
      flexDirection: isMessageAboutChatCreating ? 'row-reverse' : 'row'
    }"
  >
    <div class="message-info__text">
      {{ messageText }}
    </div>
    <div class="message-info__name">
      {{ messageNames }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'MessageInfo';
</style>
