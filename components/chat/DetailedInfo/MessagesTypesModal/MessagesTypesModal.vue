<script setup lang="ts">
import { useUsersStore } from '~/store/users'
import BackIcon from '~/assets/icons/back-icon.svg'
import CloseIcon from '~/assets/icons/close-icon.svg'
import { useSettingsStore } from '~/store/settings'
import VoiceMessage from '~/components/chat/DetailedInfo/MessagesTypesModal/VoiceMessage/VoiceMessage.vue'
import type { MessagesTypesTitleType } from '~/types/messages'
import TextMessage from '~/components/chat/DetailedInfo/MessagesTypesModal/TextMessage/TextMessage.vue'
import ChatInput from '~/components/chat/ui/ChatInput.vue'
import { messagesTypesList } from '~/shared/const'
import PhotoMessage from '~/components/chat/DetailedInfo/MessagesTypesModal/PhotoMessage/PhotoMessage.vue'
import AppH3 from '~/components/ui/AppH3/AppH3.vue'

const usersStore = useUsersStore()
const { userId, openMessageTypeModal, dataFromSelectedTypeOfChatMessage } = storeToRefs(usersStore)

const settingStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingStore)

const messageType = ref<MessagesTypesTitleType>()
const searchInputValue = ref()

const page = ref(1)

const backToDetailedInfo = () => {
  usersStore.clearDataFromSelectedTypeOfChatMessage()
  usersStore.closeMessageTypeModal()
}

const closeDetailsInfoModal = () => {
  usersStore.clearDataFromSelectedTypeOfChatMessage()
  usersStore.closeMessageTypeModal()
  usersStore.closeDetailedModal()
}

onMounted(() => {
  messageType.value = messagesTypesList.find(type => type.action === openMessageTypeModal.value)?.title
})

</script>

<template>
  <div
    class="message-type"
    :class="{
      'message-type_mobile': isMobileSize
    }"
  >
    <div
      class="message-type__modal"
      :class="{
        'message-type__modal_mobile': isMobileSize
      }"
      @click.stop
    >
      <div class="message-type__top">
        <BackIcon
          class="message-type__back-icon"
          @click="backToDetailedInfo"
        />
        <AppH3 class="message-type__title">
          {{ messageType }}
        </AppH3>
        <CloseIcon
          class="message-type__close-icon"
          @click="closeDetailsInfoModal"
        />
      </div>
      <ChatInput
        v-model:input-value="searchInputValue"
        placeholder="Найти"
        class="message-type__search-input"
      />
      <div class="message-type__body">
        <div
          v-if="messageType === 'Текстовые сообщения'"
          class="message-type__text-message"
        >
          <TextMessage
            v-for="(message, idx) in dataFromSelectedTypeOfChatMessage"
            :key="message.id"
            :is-next-message-own="dataFromSelectedTypeOfChatMessage[idx]?.userId === dataFromSelectedTypeOfChatMessage[idx + 1]?.userId"
            :is-own-message="message.userId === userId"
            :date="message.date"
            :text="message.message"
            :is-new-messages-date="idx === 0 || dataFromSelectedTypeOfChatMessage[idx]?.date?.slice(0, 10) !== dataFromSelectedTypeOfChatMessage[idx - 1]?.date?.slice(0, 10)"
            :is-next-message-new-date="dataFromSelectedTypeOfChatMessage[idx]?.date?.slice(0, 10) !== dataFromSelectedTypeOfChatMessage[idx + 1]?.date?.slice(0, 10)"
          />
        </div>

        <div
          v-if="messageType === 'Голосовые сообщения'"
          class="message-type__voice-message"
        >
          <VoiceMessage
            v-for="message in dataFromSelectedTypeOfChatMessage"
            :key="message.id"
            :date="message?.date"
            :is-received="message?.isReceived"
            :is-own-message="userId === message.userId"
            :audio-message="message?.audioMessage"
            :is-viewed="message?.isViewed"
            :is-in-voice-messages-list="true"
          />
        </div>

        <div
          v-if="messageType === 'Фотографии'"
          class="message-type__photo-message"
        >
          <PhotoMessage
            :photo-messages="dataFromSelectedTypeOfChatMessage"
          />
        </div>

        <div
          v-if="messageType === 'Ссылки'"
          class="message-type__link-message"
        >
          <LinkMessage
            :link-message="dataFromSelectedTypeOfChatMessage"
          />
        </div>
      </div>
    </div>

    <div
      v-if="!isMobileSize"
      class="message-type__bg-padding"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/_variables.scss' as variables;
.message-type {
  z-index: 1100;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.message-type_mobile {
  left: 0;
  transform: translateX(0);
  width: 100vw;
  height: 100%;
}

.message-type__modal {
  position: relative;
  width: 400px;
  z-index: 1100;
  border-radius: 15px;
  padding-right: 2px;
  padding-top: 25px;
  padding-bottom: 25px;
  border: 1px solid #979797;
  background-color: #f7f8fa;
}

.message-type__modal_mobile {
  width: 100%;
  border: 1px solid transparent;
  border-radius: 0;
  height: 100%;

  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow-y: auto;
}

.message-type__top {
  margin-bottom: 25px;
}

.message-type__back-icon {
  position: absolute;
  height: 28px;
  top: 25px;
  left: 20px;
  cursor: pointer;
}

.message-type__close-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
}

.message-type__title {
  padding: 0 69px;
  font-size: 20px;
  font-weight: 400;
  color: variables.$color-black;
}

.message-type__search-input {
  padding: 0 25px 25px;
}

.message-type__body {
  max-height: calc(96vh - 155px);
  overflow-y: auto;
  padding-bottom: 25px;

  &::-webkit-scrollbar {
    width: 3px;
    height: 122px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: variables.$color-blue-grey;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
}

.message-type__bg-padding {
  height: 10vh;
  background-color: transparent;
}
</style>
