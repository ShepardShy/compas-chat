<script setup lang="ts">
import ViewedMessageIcon from 'assets/icons/viewed-message-icon.svg'
import ReceivedMessageIcon from 'assets/icons/recieved-message-icon.svg'
import PinnedIcon from 'assets/icons/pin-icon.svg'
import MuteOffIcon from 'assets/icons/mute-off-icon.svg'
import { useUsersStore } from '~/store/users'
import type { MessageType, UserChatType } from '~/types/messages'
import { daysOfWeek } from '~/shared/const'

import './UserChat.scss'
import ChatPhoto from '~/components/chat/ChatPhoto/ChatPhoto.vue'

interface PropsType {
  chatData: UserChatType
}

const props = defineProps<PropsType>()
const { chatData } = toRefs(props)

const usersStore = useUsersStore()
const { openedChatId, userId } = storeToRefs(usersStore)

const isUserChatModalOpen = ref(false)

const userFullName = computed<string>(() => chatData.value.firstName + ' ' + chatData.value.secondName)
const lastMessage = computed<MessageType | {}>(() => {
  if (chatData.value.messages.length) {
    return chatData.value.messages[chatData.value.messages.length - 1]
  }

  return {}
})
const unreadMessagesLength = computed<number>(() => chatData.value.messages.filter(message => message.isUnread).length)

const isMessageReceived = computed(() => {
  return userId.value === lastMessage.value.userId &&
      lastMessage.value.isReceived &&
      !lastMessage.value.isViewed
})

const isMessageViewed = computed(() => {
  return userId.value === lastMessage.value.userId &&
      lastMessage.value.isViewed
})

const messageTimeInfo = computed(() => {
  if (lastMessage.value?.id) {
    const dateParts = lastMessage.value.date.slice(0, 10).split('.')
    const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0])
    const today = new Date()

    const timeDiff = today.getTime() - date.getTime()
    const oneDay = 24 * 60 * 60 * 1000
    const diffDays = Math.floor(timeDiff / oneDay)

    const dayOfWeek = daysOfWeek[date.getDay()]

    if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
      return lastMessage.value.date.slice(-5)
    } else if (diffDays <= 7) {
      return dayOfWeek
    } else if (diffDays > 7) {
      return lastMessage.value.date.slice(0, 5)
    }
  }

  return ''
})

const unpinUser = async () => {
  await usersStore.unpinUser(chatData.value.id)
}

const toggleMute = async () => {
  await usersStore.toggleUserMuted(chatData.value.id)
}

const onMouseClickUserChat = (event: MouseEvent) => {
  const iconsComponents = [...document.querySelectorAll('.icon')]

  if (!iconsComponents.includes(event.target.closest('.icon'))) {
    if (event.button === 0) {
      // при нажатии ПКМ открыть чат
      usersStore.$patch(state => state.openedChatId = chatData.value.id)
    } else if (event.button === 2) {
      //  при нажатии ЛКМ открыть модалку для действий с диалогом пользователя
      isUserChatModalOpen.value = true
    }
  }
}
</script>

<template>
  <div
    class="user"
    :class="{
      'user__chat_open': openedChatId === chatData.id
    }"
    @mousedown="onMouseClickUserChat($event)"
  >
    <ChatPhoto
      :is-active="chatData.isActive"
      :is-pinned="chatData.isPinned"
      :user-name="chatData.firstName"
      :photo="chatData.photo"
      :user-id="chatData.id"
      :is-group-chat="chatData.isGroupChat"
    />

    <div class="user__data">
      <div class="user__personal">
        <div class="user__full-name">
          {{ userFullName }}
        </div>

        <div class="user__message-status">
          <ViewedMessageIcon
            v-if="isMessageViewed"
          />
          <ReceivedMessageIcon
            v-if="isMessageReceived"
          />

          {{ messageTimeInfo }}
        </div>
      </div>

      <div
        v-if="!chatData.isTyping"
        class="user__last-message"
      >
        <span v-if="lastMessage?.id && lastMessage?.userId === chatData.id">
          <span class="user__user-message-last"> Вы: </span> {{ lastMessage.message }}
        </span>
        <span v-else> {{ lastMessage.message ?? '' }} </span>
      </div>

      <div
        v-if="chatData.isTyping"
        class="user__is-typing"
      >
        печатает

        <span class="type__circles">
          <span class="type__circle" />
          <span class="type__circle" />
          <span class="type__circle" />
        </span>
      </div>

      <div class="user__chat-info icon">
        <MuteOffIcon
          v-if="chatData.isMutedOff"
          class="user__muted"
          @click="toggleMute"
        />

        <div
          v-if="unreadMessagesLength"
          class="user__unread-msg"
        >
          {{ unreadMessagesLength }}
        </div>

        <PinnedIcon
          v-if="chatData.isPinned"
          class="user__pinned icon"
          @click="unpinUser"
        />
      </div>
    </div>
  </div>
</template>
