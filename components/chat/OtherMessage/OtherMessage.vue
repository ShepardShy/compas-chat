<script setup lang="ts">

import type {GroupChatMessageType, MessageType, UserChatType} from '~/types/messages'
import {useUsersStore} from "~/store/users";

interface PropsType {
  message: GroupChatMessageType | MessageType
  lastOfSeveralMsgs: boolean
}

const usersStore = useUsersStore()
const { chats } = storeToRefs(usersStore)

const props = defineProps<PropsType>()
const {message, lastOfSeveralMsgs} = toRefs(props)

const messageTime = ():string => {
  return message.value.date.slice(-5)
}

const chatUser = computed<UserChatType>(() => chats.value.find(chat => chat.userId === message.value.userId))

const chatPhoto = computed<string>(() => {
  if (!lastOfSeveralMsgs.value) return 'none'

  if (chatUser.value.photo) {
    return `url(${chatUser.value.photo})`
  } else {
    return 'linear-gradient(to bottom, #71d2fc 2%, #9490ff 100%)'
  }
})
</script>

<template>
  <div class="other-msg">
    <div
        class="other-msg__photo"
        :style="{
          backgroundImage: chatPhoto
        }"
    >
      <div
          v-if="!chatUser.photo"
          class="other-msg__first-name-letter">
        {{ chatUser.firstName[0] }}
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
@import './OtherMessage.scss';
</style>
