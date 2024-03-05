<script setup lang="ts">
import ViewedMessageIcon from 'assets/icons/viewed-message-icon.svg'
import ReceivedMessageIcon from 'assets/icons/recieved-message-icon.svg'
import PinnedIcon from 'assets/icons/pin-icon.svg'
import MuteOffIcon from 'assets/icons/mute-off-icon.svg'
import { useUsersStore } from '~/store/users'
import type { MessageType, UserChatType } from '~/types/messages'

import ChatPhoto from '~/components/chat/ChatPhoto/ChatPhoto.vue'
import ChatMenu from '~/components/chat/ChatMenu/ChatMenu.vue'
import { getDistanceToViewport, messageTimeInfo } from '~/composables/chats'
import { useSettingsStore } from '~/store/settings'

interface PropsType {
  chatData: UserChatType
}

const props = defineProps<PropsType>()
const { chatData } = toRefs(props)

const usersStore = useUsersStore()
const { openedChatId, userId, chatsWithPinnedUsers } = storeToRefs(usersStore)

const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

const userFullName = computed<string>(() => chatData.value.firstName + ' ' + chatData.value.secondName)
const lastMessage = computed<MessageType | {}>(() => {
  if (chatData.value?.messages?.length) {
    return chatData.value.messages[chatData.value.messages.length - 1]
  }

  return {}
})
const unreadMessagesLength = computed<number>(() => chatData.value.messages.filter(message => message.isUnread).length)

const isMessageReceived = computed<boolean>(() => {
  return userId.value === lastMessage.value.userId &&
      lastMessage.value.isReceived &&
      !lastMessage.value.isViewed
})

const isMessageViewed = computed<boolean>(() => {
  return userId.value === lastMessage.value.userId &&
      lastMessage.value.isViewed
})

const onMouseClickUserChat = (event: MouseEvent) => {
  if (event.button === 0) {
    // при нажатии ПКМ открыть чат
    settingsStore.$patch(state => state.isChatsShown = false)
    usersStore.$patch(state => state.openedChatId = chatData.value.id)
  }
}

const borderRadiusForActiveChat = computed(() => {
  if (chatData.value.isPinned &&
      chatsWithPinnedUsers.value[chatsWithPinnedUsers.value.length - 1].id === chatData.value.id) {
    return '0 0 9px 9px'
  } else if (chatData.value.isPinned &&
      chatsWithPinnedUsers.value[0].id === chatData.value.id) {
    return '9px 9px 0 0'
  }

  return '0'
})

const $menuItem = ref()
</script>

<template>
  <div
    ref="$menuItem"
    class="user"
    :class="{
      'user__chat_open': openedChatId === chatData.id
    }"
    :style="{
      'border-bottom': chatData.isPinned ? 'none' : 'solid 1px #eeeff1',
      'borderRadius': borderRadiusForActiveChat,
    }"
    @mousedown.prevent="onMouseClickUserChat($event)"
  >
    <ChatPhoto
      :is-active="chatData.isActive"
      :is-pinned="chatData.isPinned"
      :chat-name="chatData.firstName"
      :photo="chatData.photo"
      :chat-id="chatData.id"
      :is-group-chat="chatData.isGroupChat"
    />

    <div class="user__data">
      <div class="user__personal">
        <div class="user__full-name">
          <span>
            {{ userFullName }}
          </span>
        </div>

        <div class="user__message-status">
          <ViewedMessageIcon
            v-if="isMessageViewed"
          />
          <ReceivedMessageIcon
            v-if="isMessageReceived"
          />

          {{ messageTimeInfo(lastMessage) }}
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
          class="user__muted icon"
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
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'UserChat';
</style>
