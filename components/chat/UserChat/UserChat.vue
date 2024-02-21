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

interface PropsType {
  chatData: UserChatType
}

const props = defineProps<PropsType>()
const { chatData } = toRefs(props)

const usersStore = useUsersStore()
const { openedChatId, userId, chatsWithPinnedUsers, chatsWithoutPinned } = storeToRefs(usersStore)

const isDetailedChatOpen = ref(false)

const userFullName = computed<string>(() => chatData.value.firstName + ' ' + chatData.value.secondName)
const lastMessage = computed<MessageType | {}>(() => {
  if (chatData.value.messages.length) {
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

const togglePinUser = async () => {
  await usersStore.togglePinUser(chatData.value.id)
}

const toggleMute = async () => {
  await usersStore.toggleUserMuted(chatData.value.id)
}

const distanceToViewport = ref<{ top: string, bottom: string } | {}>({})

const onMouseClickUserChat = (event: MouseEvent) => {
  const iconsComponents = [...document.querySelectorAll('.icon')]

  // Чтобы при нажатии на иконку не открывалось меню, а срабатывало событие нажатия на иконку

  if (!iconsComponents.includes(event.target.closest('.icon'))) {
    if (event.button === 0) {
      // при нажатии ПКМ открыть чат
      usersStore.$patch(state => state.openedChatId = chatData.value.id)
    } else if (event.button === 2) {
      //  при нажатии ЛКМ открыть модалку для действий с диалогом пользователя
      distanceToViewport.value = getDistanceToViewport(event.target)
      isDetailedChatOpen.value = !isDetailedChatOpen.value
    }
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

useEventListener(document, 'contextmenu', (event) => {
  const elem = event.target.className

  if (elem.includes('user')) {
    event.preventDefault()
  }
})

const toggleMenuOpen = () => isDetailedChatOpen.value = !isDetailedChatOpen.value
</script>

<template>
  <div
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
          @click="togglePinUser"
        />
      </div>
    </div>

    <div
      v-if="isDetailedChatOpen"
      class="user__menu-bg"
      @click="toggleMenuOpen"
    />

    <ChatMenu
      v-if="isDetailedChatOpen"
      v-model:is-detailed-chat-open="isDetailedChatOpen"
      :style="{
        top: distanceToViewport.bottom < 240 ? '-172px' : '30px',
        right: '10px',
      }"
      :chat-id="chatData.id"
      :is-pinned="chatData.isPinned"
      :is-muted-off="chatData.isMutedOff"
      :is-user-chat-left="true"
      @close-chat="toggleMenuOpen"
    />
  </div>
</template>

<style scoped lang="scss">
  @import './UserChat.scss';
</style>
