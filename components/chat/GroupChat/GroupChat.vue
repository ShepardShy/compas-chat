<script setup lang="ts">
import { useUsersStore } from '~/store/users'
import PinnedIcon from 'assets/icons/pin-icon.svg'
import ReceivedMessageIcon from 'assets/icons/recieved-message-icon.svg'
import MuteOffIcon from 'assets/icons/mute-off-icon.svg'
import ViewedMessageIcon from 'assets/icons/viewed-message-icon.svg'
import ChatPhoto from '~/components/chat/ChatPhoto/ChatPhoto.vue'

import GroupChatIcon from '~/assets/icons/group-chat-icon.svg'

import type { GroupChatMessageType, GroupChatType } from '~/types/messages'
import ChatMenu from '~/components/chat/ChatMenu/ChatMenu.vue'
import { getDistanceToViewport, messageTimeInfo } from '~/composables/chats'
import { useSettingsStore } from '~/store/settings'

interface PropsType {
  chatData: GroupChatType
}

const props = defineProps<PropsType>()
const { chatData } = toRefs(props)

const usersStore = useUsersStore()
const { openedChatId, userId, chatsWithPinnedUsers } = storeToRefs(usersStore)

const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

const isDetailedChatOpen = ref(false)

const lastMessage = computed<GroupChatMessageType | {}>(() => {
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

const unpinUser = async () => {
  await usersStore.unpinUser(chatData.value.id)
}

const toggleMute = async () => {
  await usersStore.toggleUserMuted(chatData.value.id)
}

const distanceToViewport = ref()

const onMouseClickUserChat = (event: MouseEvent) => {
  const iconsComponents = [...document.querySelectorAll('.icon')]

  // Чтобы при нажатии на иконку не открывалось меню, а срабатывало событие нажатия на иконку

  if (!iconsComponents.includes(event.target.closest('.icon'))) {
    if (event.button === 0) {
      // при нажатии ЛКМ открыть чат
      settingsStore.$patch(state => state.isChatsShown = false)
      usersStore.$patch(state => state.openedChatId = chatData.value.id)
    } else if (event.button === 2) {
      //  при нажатии ПКМ открыть модалку для действий с диалогом пользователя
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

  if (elem.includes('group')) {
    event.preventDefault()
  }
})

const toggleMenuOpen = () => isDetailedChatOpen.value = !isDetailedChatOpen.value
</script>

<template>
  <div
    class="group"
    :class="{
      'group__chat_open': openedChatId === chatData.id,
    }"
    :style="{
      'border-bottom': chatData.isPinned ? 'none' : 'solid 1px #eeeff1',
      'borderRadius': borderRadiusForActiveChat,
    }"
    @mousedown="onMouseClickUserChat($event)"
  >
    <ChatPhoto
      :is-pinned="chatData.isPinned"
      :is-group-chat="chatData.isGroupChat"
      :chat-name="chatData.title"
      :photo="chatData.photo"
      :user-id="chatData.id"
    />

    <div class="group__data">
      <div class="group__info">
        <div class="group__title">
          <GroupChatIcon class="group__title-icon" />

          <div>{{ chatData.title }}</div>
        </div>

        <div class="group__message-status">
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
        class="group__last-message"
      >
        <span v-if="lastMessage?.id && lastMessage?.userId === userId">
          <span class="group__user-message-last"> Вы: </span>
          {{ lastMessage.message }}
        </span>
        <span v-else>
          <span class="group__user-message-last">
            {{ lastMessage.firstName + ' ' + lastMessage.secondName }}:
          </span>
          {{ lastMessage.message }}
        </span>
      </div>

      <div
        v-if="chatData.isTyping"
        class="group__is-typing"
      >
        печатает

        <span class="type__circles">
          <span class="type__circle" />
          <span class="type__circle" />
          <span class="type__circle" />
        </span>
      </div>

      <div class="group__chat-info icon">
        <MuteOffIcon
          v-if="chatData.isMutedOff"
          class="user__muted icon"
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

    <div
      v-if="isDetailedChatOpen"
      class="group__menu-bg"
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
@import './GroupChat.scss';
</style>
