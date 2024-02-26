<script setup lang="ts">

import AppH3 from '~/components/ui/AppH3/AppH3.vue'
import { useUsersStore } from '~/store/users'
import { chatMenuItems, detailedInfoMenuItems } from '~/shared/const'
import type { ChatMenuType, DetailedInfoMenuItem } from '~/types/messages'

import MuteOffIcon from 'assets/icons/mute-off-icon.svg'
import MuteIcon from 'assets/icons/mute-icon.svg'
import PinIcon from 'assets/icons/pin-icon.svg'
import FileMessagesIcon from 'assets/icons/file-messages-icon.svg'
import LinkMessagesIcon from 'assets/icons/link-messages-icon.svg'
import ImageMessagesIcon from 'assets/icons/photo-messages-icon.svg'
import TextMessagesIcon from 'assets/icons/text-messages-icon.svg'
import VideoMessagesIcon from 'assets/icons/video-messages-icon.svg'
import VoiceMessagesIcon from 'assets/icons/voice-messages-icon.svg'
import DeleteIcon from 'assets/icons/delete-icon.svg'
import CloseIcon from 'assets/icons/close-icon.svg'

import ChatPhoto from '~/components/chat/ChatPhoto/ChatPhoto.vue'

const usersStore = useUsersStore()
const { openModalChatData } = storeToRefs(usersStore)

interface PropsType {
  isDetailedModalOpen: boolean
}

const props = defineProps<PropsType>()
const { isDetailedModalOpen } = toRefs(props)

const emit = defineEmits<{(emit: 'update:isDetailedModalOpen', value: boolean): void }>()

const userFullName = computed<string>(() => {
  if (openModalChatData.value.firstName) {
    return openModalChatData.value?.firstName + ' ' + openModalChatData.value?.secondName
  } else {
    return openModalChatData.value?.secondName
  }
})

const chatMenuValues = computed(() => chatMenuItems.filter(item => item.action === 'pinChat' || item.action === 'muteChat'))

const onClickDoAction = async (menuItem: ChatMenuType) => {
  switch (menuItem.action) {
    case 'muteChat': {
      await usersStore.toggleUserMuted(openModalChatData.value.id!)
      break
    }
    case 'pinChat': {
      await usersStore.togglePinUser(openModalChatData.value.id!)
      break
    }
  }
}

const showMenuItem = (menuItem: ChatMenuType) => {
  if (menuItem.action === 'pinChat') {
    return !openModalChatData.value.isPinned ? menuItem.title : menuItem.alternativeTitle
  } else if (menuItem.action === 'muteChat') {
    return !openModalChatData.value.isMutedOff ? menuItem.title : menuItem.alternativeTitle
  }
}

const showModalMenuItemTitle = (item: DetailedInfoMenuItem) => {
  switch (item.action) {
    case 'text-messages': {
      return setCorrectTitle(openModalChatData.value.totalTextMessages)
    }
    case 'images-messages': {
      return setCorrectTitle(openModalChatData.value.totalPhotoMessages)
    }

    case 'video-messages': {
      return setCorrectTitle(openModalChatData.value.totalVideoMessages)
    }

    case 'file-messages': {
      return setCorrectTitle(openModalChatData.value.totalFileMessages)
    }

    case 'voice-messages': {
      return setCorrectTitle(openModalChatData.value.totalVoiceMessages)
    }

    case 'link-messages': {
      return setCorrectTitle(openModalChatData.value.totalLinksMessages)
    }

    case 'delete-messages': {
      return item.titleOne
    }
  }

  function setCorrectTitle (quantity: number) {
    const lastDigit = quantity.toString().slice(-1)
    if (+lastDigit === 1) {
      return quantity + ' ' + item.titleOne
    } else if (+lastDigit >= 2 && +lastDigit <= 4) {
      return quantity + ' ' + item.titleTwo
    } else {
      return quantity + ' ' + item.titleThree
    }
  }
}

const closeModal = () => {
  emit('update:isDetailedModalOpen', !isDetailedModalOpen.value)
}

const onClickDetailedInfoMenuItem = async (item: DetailedInfoMenuItem) => {
  switch (item.action) {
    case 'delete-messages': {
      await usersStore.deleteChat(openModalChatData.value.id)
      usersStore.$patch(state => state.chatIdForOpenModal = undefined)
      break
    }

    default: {
      detailedMenuActiveDataType.value = item.action
    }
  }
}

const detailedMenuActiveDataType = ref()
</script>

<template>
  <div class="add-info">
    <div class="add-info__modal">
      <CloseIcon
        class="add-info__close-icon"
        @click="closeModal"
      />

      <AppH3 class="add-info__title">
        Подробная информация
      </AppH3>

      <ChatPhoto
        class="add-info__img"
        :user-id="openModalChatData.userId"
        :is-pinned="openModalChatData.isPinned"
        :is-active="openModalChatData.isActive"
        :photo="openModalChatData.photo"
        :chat-name="userFullName"
        :is-group-chat="false"
        :is-detailed-menu="true"
      />

      <div class="menu__active">
        {{ openModalChatData.isActive ? 'В сети' : 'Не в сети' }}
      </div>

      <div class="menu__name">
        {{ userFullName }}
      </div>

      <div class="menu__position">
        {{ openModalChatData.position ?? '' }}
      </div>

      <div
        v-for="(item,idx) in chatMenuValues"
        :key="item.title"
        class="menu__item"
        :class="{
          'menu__item_last': idx === chatMenuValues.length - 1
        }"
        @click="onClickDoAction(item)"
      >
        <div
          v-if="item.icon"
          class="menu__item-icon"
        >
          <MuteOffIcon
            v-if="item.action == 'muteChat' && !openModalChatData.isMutedOff"
            class="menu__item-img"
          />

          <MuteIcon
            v-if="item.action == 'muteChat' && openModalChatData.isMutedOff"
            class="menu__item-img"
          />

          <PinIcon
            v-if="item.action == 'pinChat'"
            class="menu__item-img"
          />
        </div>

        {{ showMenuItem(item) }}
      </div>

      <div
        v-for="(item, idx) in detailedInfoMenuItems"
        :key="item.action"
        class="details-menu__item"
        :class="{
          'details-menu__item_first': idx === 0,
          'details-menu__item_pre-last': idx === detailedInfoMenuItems.length - 2,
          'details-menu__item_last': idx === detailedInfoMenuItems.length - 1,
        }"
        @click="onClickDetailedInfoMenuItem(item)"
      >
        <FileMessagesIcon v-if="item.icon === 'file-messages-icon'" />
        <VoiceMessagesIcon v-if="item.icon === 'voice-messages-icon'" />
        <TextMessagesIcon v-if="item.icon === 'text-messages-icon'" />
        <LinkMessagesIcon v-if="item.icon === 'link-messages-icon'" />
        <ImageMessagesIcon v-if="item.icon === 'images-messages-icon'" />
        <VideoMessagesIcon v-if="item.icon === 'video-messages-icon'" />
        <DeleteIcon v-if="item.icon === 'delete-icon'" />

        <div>{{ showModalMenuItemTitle(item) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/_variables.scss' as variables;

.add-info {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-info__modal {
  width: 400px;
  background-color: variables.$color-white;
  position: relative;
  z-index: 1100;
  padding-top: 25px;
  padding-bottom: 25px;
  border-radius: 15px;
  border: 1px solid #979797;
  overflow: hidden;
}

.add-info__title {
  font-size: 20px;
  font-weight: 400;
  color: variables.$color-black;
  margin-bottom: 25px;
  padding-left: 25px;
  padding-right: 25px;
}

.menu__active {
  font-size: 12px;
  font-weight: 400;
  color: variables.$color-dark-grey;
  margin-bottom: 5px;
  text-align: center;
}

.menu__name {
  margin-bottom: 10px;
  text-align: center;
  font-size: 21px;
  font-weight: 400;
  text-decoration: underline;
  color: variables.$color-active;
}

.menu__position {
  margin-bottom: 5px;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  color: variables.$color-dark-grey;
}

.add-info__img {
  margin: 0 auto 10px;
}

.add-info__close-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  transition: 0.3s all;
}

.add-info__close-icon:hover {
  scale: 1.1;
}

.menu__item {
  padding: 10px 25px 10px 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: variables.$color-dark;
  display: flex;
  gap: 10px;
}

.menu__item_last {
  padding: 10px 25px 20px 25px;
}

.menu__item-icon {
  border-radius: 5px;
  background-color: #0584fe;
  width: 18px;
  height: 18px;
  margin: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu__item-img {
  transform: scale(0.7);
  color: #fff;
}

.menu__item_active {
  background-color: variables.$color-light-grey;
}

.menu__item:nth-of-type(1) {
  border-radius: 7px 7px 0 0;
}

.details-menu__item {
  padding: 10px 25px;
  background-color: #f7f8fa;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: variables.$color-dark;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  transition: 0.2s all;
}

.details-menu__item:not(:last-of-type):hover {
  scale: 1.03;
}

.details-menu__item_first {
  padding-top: 20px;
}

.details-menu__item_pre-last {
  padding-bottom: 20px;
}

.details-menu__item_last {
  padding-top: 20px;
  padding-bottom: 0;
  color: variables.$color-red;
  background-color: variables.$color-white;
}
</style>
