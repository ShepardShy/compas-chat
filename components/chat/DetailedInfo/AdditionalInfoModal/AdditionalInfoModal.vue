<script setup lang="ts">

import AppH3 from '~/components/ui/AppH3/AppH3.vue'
import { useUsersStore } from '~/store/users'
import { chatMenuItems, detailedInfoMenuItems } from '~/shared/const'
import type { ChatMenuType, DetailedInfoMenuItem } from '~/types/messages'

import MuteOffIcon from 'assets/icons/mute-off-icon.svg'

import PinIcon from 'assets/icons/pin-icon.svg'
import FileMessagesIcon from 'assets/icons/file-messages-icon.svg'
import LinkMessagesIcon from 'assets/icons/link-messages-icon.svg'
import ImageMessagesIcon from 'assets/icons/photo-messages-icon.svg'
import TextMessagesIcon from 'assets/icons/text-messages-icon.svg'
import VideoMessagesIcon from 'assets/icons/video-messages-icon.svg'
import VoiceMessagesIcon from 'assets/icons/voice-messages-icon.svg'
import DeleteIcon from 'assets/icons/delete-icon.svg'
import CloseIcon from 'assets/icons/close-icon.svg'
import GroupChatIcon from 'assets/icons/group-chat-icon.svg'
import AddUserIcon from 'assets/icons/add-user-icon.svg'

import ChatPhoto from '~/components/chat/ChatPhoto/ChatPhoto.vue'
import { useSettingsStore } from '~/store/settings'
import BackIcon from 'assets/icons/back-icon.svg'
import GroupChatUser from '~/components/chat/DetailedInfo/GroupChatUser/GroupChatUser.vue'

const usersStore = useUsersStore()
const { openModalChatData, chats, chatIdForOpenModal } = storeToRefs(usersStore)

const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

const isGroupChat = computed(() => [...chats.value].find(chat => chat.id === chatIdForOpenModal.value).isGroupChat)

const chatFullName = computed<string>(() => {
  if (isGroupChat.value) {
    return openModalChatData.value?.title
  }

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
  // if (menuItem.action === 'pinChat') {
  //   return !openModalChatData.value.isPinned ? menuItem.title : menuItem.alternativeTitle
  // } else if (menuItem.action === 'muteChat') {
  //   return !openModalChatData.value.isMutedOff ? menuItem.title : menuItem.alternativeTitle
  // }

  return menuItem.title
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
  usersStore.closeDetailedModal()
  usersStore.closeAddUserModal()
  usersStore.clearChatIdForOpenModal()
}

const onClickDetailedInfoMenuItem = async (item: DetailedInfoMenuItem) => {
  switch (item.action) {
    case 'delete-messages': {
      await usersStore.deleteChat(openModalChatData.value.id)
      usersStore.clearChatIdForOpenModal()
      break
    }

    default: {
      detailedMenuActiveDataType.value = item.action
      usersStore.$patch(state => state.openMessageTypeModal = item.action)
      usersStore.$patch(state => state.isOpenMessageTypeModal = true)

      if (item.action === 'text-messages') {
        usersStore.getTextMessages()
      }

      if (item.action === 'images-messages') {
        usersStore.getPhotoMessages()
      }

      // if (item.action === 'voice-messages') {
      //   usersStore.getVoiceMessages()
      // }
    }
  }
}

const detailedMenuActiveDataType = ref()

const groupChatUsersTotal = computed(() => {
  if (!openModalChatData.value?.users) return

  const totalUsers = openModalChatData.value?.users?.length
  const lastDigit = totalUsers.toString().slice(-1)
  if (+lastDigit === 1) {
    return totalUsers + ' ' + 'участник'
  } else if (+lastDigit >= 2 && +lastDigit <= 4) {
    return totalUsers + ' ' + 'участника'
  } else {
    return totalUsers + ' ' + 'участников'
  }
})

const filteredDetailedInfoMenuItems = computed(() => {
  if (isGroupChat.value) {
    return detailedInfoMenuItems.slice(0, detailedInfoMenuItems.length - 2)
  } else {
    return detailedInfoMenuItems
  }
})

const lastDetailedInfoMenuItem = computed(() => detailedInfoMenuItems[detailedInfoMenuItems.length - 1])

const openAddUserModal = () => {
  usersStore.$patch(state => state.isAddUserModalOpen = true)
}
</script>

<template>
  <div
    class="add-info__modal"
    :class="{
      'add-info__modal_mobile':isMobileSize}"
  >
    <BackIcon
      v-if="isMobileSize"
      class="add-info__back-icon"
      @click="closeModal"
    />

    <CloseIcon
      v-if="!isMobileSize"
      class="add-info__close-icon"
      @click="closeModal"
    />

    <AppH3
      class="add-info__title"
      :class="{
        'add-info__title_mobile': isMobileSize
      }"
    >
      Подробная информация
    </AppH3>

    <ChatPhoto
      class="add-info__img"
      :chat-id="openModalChatData.id"
      :is-pinned="openModalChatData.isPinned"
      :is-active="openModalChatData.isActive"
      :photo="openModalChatData.photo"
      :chat-name="chatFullName"
      :is-group-chat="isGroupChat"
      :is-detailed-menu="true"
    />

    <div
      v-if="!isGroupChat"
      class="menu__active"
    >
      {{ openModalChatData.isActive ? 'В сети' : 'Не в сети' }}
    </div>

    <div
      v-if="!isGroupChat"
      class="menu__name"
    >
      {{ chatFullName }}
    </div>

    <div
      v-if="isGroupChat"
      class="menu__title"
    >
      {{ chatFullName }}
    </div>

    <div
      v-if="!isGroupChat"
      class="menu__position"
    >
      {{ openModalChatData.position ?? '' }}
    </div>

    <div
      v-if="isGroupChat"
      class="menu__participants"
    >
      {{ groupChatUsersTotal }}
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
        :class="{
          'menu__item-icon_not-selected': (item.action == 'muteChat' && !openModalChatData.isMutedOff) || (item.action == 'pinChat' && !openModalChatData.isPinned)
        }"
      >
        <MuteOffIcon
          v-if="item.action == 'muteChat' && openModalChatData.isMutedOff"
          class="menu__item-img"
        />

        <PinIcon
          v-if="item.action == 'pinChat' && openModalChatData.isPinned"
          class="menu__item-img"
        />
      </div>

      {{ showMenuItem(item) }}
    </div>

    <div
      v-for="(item, idx) in filteredDetailedInfoMenuItems"
      :key="item.action"
      class="details-menu__item"
      :class="{
        'details-menu__item_first': idx === 0,
        'details-menu__item_pre-last': !isGroupChat && idx === detailedInfoMenuItems.length - 2,
        'details-menu__item_last': !isGroupChat && idx === detailedInfoMenuItems.length - 1,
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

    <div
      v-if="isGroupChat"
      class="details-menu__group-users-data"
    >
      <div class="details-menu__group-users-action">
        <div class="details-menu__group-users-info">
          <GroupChatIcon />
          <div class="details-menu__group-users-total">
            {{ `${groupChatUsersTotal} группы` }}
          </div>
        </div>
        <AddUserIcon
          class="details-menu__add-user"
          @click="openAddUserModal"
        />
      </div>
      <div class="details-menu__group-users">
        <GroupChatUser
          v-for="user in openModalChatData.users"
          :key="user.id"
          :user-data="user"
        />
      </div>
    </div>

    <div
      v-if="isGroupChat"
      class="details-menu__item details-menu__item_last"
      @click="onClickDetailedInfoMenuItem(lastDetailedInfoMenuItem)"
    >
      <DeleteIcon />

      <div>{{ showModalMenuItemTitle(lastDetailedInfoMenuItem) }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/_variables.scss' as variables;

.add-info__modal {
  padding-top: 25px;
  padding-bottom: 25px;
  background-color: variables.$color-white;
  border-radius: 15px;
  border: 1px solid #979797;
  width: 400px;
  z-index: 1100;
  position: relative;
  max-height: 96vh;
  overflow-y: auto;
  overflow-x: hidden;

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

.add-info__modal_mobile {
  width: 100%;
  border: 1px solid transparent;
  border-radius: 0;
  height: 100%;
  max-height: 100%;

  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
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

.add-info__back-icon {
  height: 25px;
  position: absolute;
  top: 25px;
  left: 10px;
  cursor: pointer;
}

.add-info__title {
  font-size: 20px;
  font-weight: 400;
  color: variables.$color-black;
  margin-bottom: 25px;
  padding-left: 25px;
  padding-right: 25px;
}

.add-info__title_mobile {
  padding-left: 45px;
}

.menu__active {
  font-size: 12px;
  font-weight: 400;
  color: variables.$color-dark-grey;
  margin-bottom: 0px;
  text-align: center;
}

.menu__name {
  margin-bottom: 5px;
  text-align: center;
  font-size: 21px;
  font-weight: 400;
  text-decoration: underline;
  color: variables.$color-active;
}

.menu__title {
  margin-bottom: 5px;
  text-align: center;
  font-size: 21px;
  font-weight: 400;
  color: variables.$color-black;
}

.menu__position {
  margin-bottom: 5px;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  color: variables.$color-dark-grey;
}

.menu__participants {
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

.menu__item-icon_not-selected {
  background-color: transparent;
  border: 1px solid #0584fe;
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
  transition: 0.5s all;
  border-bottom: 1px solid transparent;
}

.details-menu__item:not(:last-of-type):hover {
  background-color: rgba(0, 0, 0, 0.1);

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

.details-menu__group-users-data {
  margin-top: 25px;
}

.details-menu__group-users {
  max-height: 350px;
  overflow-y: auto;
  margin-right: 5px;

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

.details-menu__group-users-action {
  display: flex;
  padding: 20px 20px 20px 25px;
  justify-content: space-between;
  align-items: center;
  background-color: #f7f8fa;
}

.details-menu__group-users-info {
  display: flex;
  gap: 5px;
  align-items: center;
}

.details-menu__add-user {
  cursor: pointer;
}
</style>
