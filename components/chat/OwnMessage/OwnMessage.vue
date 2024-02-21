<script setup lang="ts">

import type { GroupChatMessageType, MessageType } from '~/types/messages'
import ViewedMessageIcon from 'assets/icons/viewed-message-icon.svg'
import ReceivedMessageIcon from 'assets/icons/recieved-message-icon.svg'

interface PropsType {
  message: GroupChatMessageType | MessageType
  lastOfSeveralMsgs: boolean
}

const props = defineProps<PropsType>()
const { message, lastOfSeveralMsgs } = toRefs(props)

const isMessageReceived = computed<boolean>(() => {
  return message.value.isReceived &&
      !message.value.isViewed
})

const isMessageViewed = computed<boolean>(() => {
  return message.value.isViewed
})

const messageTime = ():string => {
  return message.value.date.slice(-5)
}
</script>

<template>
  <div
    class="own-msg"
    :class="{
      'own-msg__triangle ': lastOfSeveralMsgs
    }"
  >
    <div class="owm-msg__message">
      {{ message.message }}
    </div>

    <div class="own-msg__time-and-status">
      <div class="own-msg__time">
        {{ messageTime() }}
      </div>
      <ViewedMessageIcon
        v-if="isMessageViewed"
      />
      <ReceivedMessageIcon
        v-if="isMessageReceived"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './OwnMessage.scss';
</style>
