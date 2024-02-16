<script setup lang="ts">

import {useUsersStore} from '~/store/users'
import {daysOfWeek} from '~/shared/const'
import PinnedIcon from 'assets/icons/pin-icon.svg'
import ReceivedMessageIcon from 'assets/icons/recieved-message-icon.svg'
import MuteOffIcon from 'assets/icons/mute-off-icon.svg'
import ViewedMessageIcon from 'assets/icons/viewed-message-icon.svg'
import ChatPhoto from '~/components/chat/ChatPhoto/ChatPhoto.vue'

import GroupChatIcon from '~/assets/icons/group-chat-icon.svg'

import './GroupChat.scss'
import type {GroupChatMessageType, GroupChatType} from "~/types/messages";

interface PropsType {
  chatData: GroupChatType
}

const props = defineProps<PropsType>()
const {chatData} = toRefs(props)

const usersStore = useUsersStore()
const {openedChatId, userId} = storeToRefs(usersStore)

const isUserChatModalOpen = ref(false)

const lastMessage = computed<GroupChatMessageType | {}>(() => {
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
      class="group"
      :class="{
      'group__chat_open': openedChatId === chatData.id
    }"
      @mousedown="onMouseClickUserChat($event)"
  >

    <ChatPhoto
        :is-active="chatData.isActive"
        :is-pinned="chatData.isPinned"
        :is-group-chat="chatData.isGroupChat"
        :user-name="chatData.title"
        :photo="chatData.photo"
        :user-id="chatData.id"
    />

    <div class="group__data">
      <div class="group__info">
        <div class="group__title">
          <GroupChatIcon class="group__title-icon"/>

          <div>{{ chatData.title }}</div>
        </div>

        <div class="group__message-status">
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
          class="group__last-message"
      >
        <span v-if="lastMessage?.id && lastMessage?.userId === userId">
          <span class="group__user-message-last"> Вы: </span> {{ lastMessage.message }}
        </span>
        <span v-else>
         <span class="group__user-message-last"> {{ lastMessage.firstName + ' ' + lastMessage.secondName}}: </span> {{ lastMessage.message }}
        </span>
      </div>

      <div
          v-if="chatData.isTyping"
          class="group__is-typing"
      >
        печатает

        <span class="type__circles">
          <span class="type__circle"/>
          <span class="type__circle"/>
          <span class="type__circle"/>
        </span>
      </div>

      <div class="group__chat-info icon">
        <MuteOffIcon
            v-if="chatData.isMutedOff"
            class="user__muted"
            @click="toggleMute"
        />

        <div
            v-if="unreadMessagesLength"
            class="group__unread-msg"
        >
          {{ unreadMessagesLength }}
        </div>

        <PinnedIcon
            v-if="chatData.isPinned"
            class="group__pinned icon"
            @click="unpinUser"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
