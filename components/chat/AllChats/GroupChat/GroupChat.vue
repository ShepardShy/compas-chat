<script setup lang="ts">
import { useChatsStore } from '~/store/chats'
import { useSettingsStore } from '~/store/settings'

import PinnedIcon from 'assets/icons/pin-icon.svg'
import ReceivedMessageIcon from 'assets/icons/recieved-message-icon.svg'
import MuteOffIcon from 'assets/icons/mute-off-icon.svg'
import ViewedMessageIcon from 'assets/icons/viewed-message-icon.svg'
import GroupChatIcon from 'assets/icons/group-chat-icon.svg'

import { ChatPhoto } from '~/components'

import type { GroupChatMessageType, GroupChatType } from '~/types/messages'
import { messageTimeInfo, showMessage } from '~/composables/chats'

/**
 * Входящие пропсы
 */
interface PropsType {
  chatData: GroupChatType
}
const props = defineProps<PropsType>()
const { chatData } = toRefs(props)

/**
 * Подключение стора с чатами
 */
const chatsStore = useChatsStore()
const { openedChatId, userId, chatsWithPinnedUsers } = storeToRefs(chatsStore)

/**
 * Подключение стора с настройками
 */
const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

/**
 * Последнее сообщение чата
 */
const lastMessage = computed<GroupChatMessageType | {}>(() => {
  if (chatData.value.messages.length) {
    return chatData.value.messages[chatData.value.messages.length - 1]
  }

  return {}
})
/**
 * Количество непрочитанных сообщений
 */
const unreadMessagesLength = computed<number>(() => chatData.value.messages.filter(message => message.isUnread).length)
/**
 * Доставлено ли сообщение
 */
const isMessageReceived = computed<boolean>(() => {
  return userId.value === lastMessage.value.userId &&
      lastMessage.value.isReceived &&
      !lastMessage.value.isViewed
})
/**
 * Просмотрено ли сообщение
 */
const isMessageViewed = computed<boolean>(() => {
  return userId.value === lastMessage.value.userId &&
      lastMessage.value.isViewed
})

/**
 * Бордер радиус, если чат попал в закрепленные и стал первым и последним закрепленным чатом
 */
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
/**
 * Собственное сообщение
 */
const isLastMessageOwn = computed(() => lastMessage.value?.userId === userId.value)

/**
 * Событие при нажатии на чат
 * @param _event
 */
const onMouseClickUserChat = (_event: MouseEvent) => {
  if (_event.button === 0) {
    // при нажатии ЛКМ открыть чат
    settingsStore.$patch(state => state.isChatsShown = false)
    chatsStore.$patch(state => state.openedChatId = chatData.value.id)
  }
}
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
      :chat-id="chatData.id"
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
            style="color: #27AE60"
          />
          <ReceivedMessageIcon
            v-if="isMessageReceived"
            style="color: #27AE60"
          />

          {{ messageTimeInfo(lastMessage) }}
        </div>
      </div>

      <div
        v-if="!chatData.isTyping"
        class="group__last-message"
      >
        <span v-if="chatData.textMessageDraft">
          <span class="group__user-message-last"> Draft :</span>
          {{ chatData.textMessageDraft }}
        </span>

        <div v-else>
          <span v-if="isLastMessageOwn && lastMessage?.type == 'image'">
            <span class="group__user-message-last"> Вы :</span>
            {{ showMessage(lastMessage.comment, lastMessage.images.length, lastMessage.images[0].fileName, 'изображения...') }}
          </span>

          <span v-else-if="isLastMessageOwn && lastMessage?.type == 'text'">
            <span class="group__user-message-last"> Вы:</span>
            {{ showMessage(lastMessage.message) }}
          </span>

          <span v-else-if="isLastMessageOwn && lastMessage?.type == 'file'">
            <span class="group__user-message-last"> Вы:</span>
            {{ showMessage(lastMessage.comment, lastMessage.files.length, lastMessage.files[0].fileName, 'файлы...') }}
          </span>

          <span v-else-if="!isLastMessageOwn && lastMessage?.type == 'image'">
            <span class="group__user-message-last">
              {{ lastMessage?.firstName + ' ' + lastMessage?.secondName }}:
            </span>
            {{ showMessage(lastMessage.comment, lastMessage.images.length, lastMessage.images[0].fileName, 'Изображения...') }}
          </span>

          <span v-else-if="!isLastMessageOwn && lastMessage?.type == 'text'">
            <span class="group__user-message-last">
              {{ lastMessage?.firstName + ' ' + lastMessage?.secondName }}:
            </span>
            {{ showMessage(lastMessage.message) }}
          </span>

          <span v-else-if="!isLastMessageOwn && lastMessage?.type == 'file'">
            <span class="group__user-message-last">
              {{ lastMessage?.firstName + ' ' + lastMessage?.secondName }}:
            </span>
            {{ showMessage(lastMessage.comment, lastMessage.files.length, lastMessage.files[0].fileName, 'Файлы...') }}
          </span>

          <span v-else-if="lastMessage?.type == 'message-info'">
            {{ lastMessage?.message }}
          </span>
        </div>
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
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'GroupChat';
</style>
