<script setup lang="ts">
import AppH3 from '~/components/ui/AppH3/AppH3.vue'
import { useChatsStore } from '~/store/chats'
import { useSettingsStore } from '~/store/settings'

import { chatMenuItems, detailedInfoMenuItems } from '~/shared'

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
import BackIcon from 'assets/icons/back-icon.svg'

import { ChatPhoto, GroupChatUser } from '~/components'
import { showModalMenuItemTitle } from '~/composables/chats'

/**
 * Подключение стора с чатами
 */
const chatsStore = useChatsStore()
const { openModalChatData, chats, chatIdForOpenModal } = storeToRefs(chatsStore)
/**
 * Подключение стора с настройками
 */
const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

/**
 * Выбранный тип сообщений для просмотра в модалке
 */
const detailedMenuActiveDataType = ref()

/**
 * Является ли чат групповым
 */
const isGroupChat = computed(() => [...chats.value].find(chat => chat.id === chatIdForOpenModal.value).isGroupChat)
/**
 * Полное имя пользователя чата или заголосов группового чата
 */
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
/**
 * Элементы меню для усправления чатом (звук и закрепление)
 */
const chatMenuValues = computed(() => chatMenuItems.filter(item => item.action === 'pinChat' || item.action === 'muteChat'))
/**
 * Элементы для меню типов чата без Удаления
 */
const filteredDetailedInfoMenuItems = computed(() => {
  if (isGroupChat.value) {
    return detailedInfoMenuItems.slice(0, detailedInfoMenuItems.length - 2)
  } else {
    return detailedInfoMenuItems
  }
})
/**
 * Элемент для меню типов чата Удаление
 */
const lastDetailedInfoMenuItem = computed(() => detailedInfoMenuItems[detailedInfoMenuItems.length - 1])

/**
 * Управление звуком и закрепом чата
 * @param _menuItem
 */
const onClickDoAction = async (_menuItem: ChatMenuType) => {
  switch (_menuItem.action) {
    case 'muteChat': {
      await chatsStore.toggleUserMuted(openModalChatData.value.id!)
      break
    }
    case 'pinChat': {
      await chatsStore.togglePinUser(openModalChatData.value.id!)
      break
    }
  }
}
/**
 * Закрыть все модалки
 */
const closeModal = () => {
  chatsStore.closeDetailedModal()
  chatsStore.closeAddUserModal()
  chatsStore.clearChatIdForOpenModal()
}
/**
 * Открыть модалку для просмотра выбранного типа сообщения или удалить чат
 * @param _item
 */
const onClickDetailedInfoMenuItem = async (_item: DetailedInfoMenuItem) => {
  switch (_item.action) {
    case 'delete-messages': {
      await chatsStore.deleteChat(openModalChatData.value!.id)
      chatsStore.clearChatIdForOpenModal()
      chatsStore.closeDetailedModal()
      break
    }

    default: {
      detailedMenuActiveDataType.value = _item.action
      chatsStore.$patch(state => state.openMessageTypeModal = _item.action)
      chatsStore.$patch(state => state.isOpenMessageTypeModal = true)

      if (_item.action === 'text-messages') {
        chatsStore.getTextMessages()
      }

      if (_item.action === 'images-messages') {
        chatsStore.getPhotoMessages()
      }

      // if (item.action === 'voice-messages') {
      //   usersStore.getVoiceMessages()
      // }
    }
  }
}

/**
 * Всего участников в групповом чате
 */
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
/**
 * Открыть модалку Добавить в групповой чат
 */
const openAddUserModal = () => {
  chatsStore.$patch(state => state.isAddUserModalOpen = true)
}

/**
 * Проверка, что чат не закреплен и звук не выключен
 * @param _itemAction
 */
const isMenuItemNotMutedOrPinned = (_itemAction: 'muteChat' | 'pinChat') => {
  return (_itemAction == 'muteChat' && !openModalChatData.value.isMutedOff) ||
      (_itemAction == 'pinChat' && !openModalChatData.value.isPinned)
}

/**
 * Отрисовать типы сообщений
 * @param _icon
 */
const getIconComponent = (_icon) => {
  const iconComponentMap = {
    'file-messages-icon': FileMessagesIcon,
    'voice-messages-icon': VoiceMessagesIcon,
    'text-messages-icon': TextMessagesIcon,
    'link-messages-icon': LinkMessagesIcon,
    'images-messages-icon': ImageMessagesIcon,
    'video-messages-icon': VideoMessagesIcon,
    'delete-icon': DeleteIcon
  }

  return iconComponentMap[_icon] || null
}
</script>

<template>
  <div
    class="add-info"
    :class="{
      'add-info_mobile':isMobileSize
    }"
  >
    <div
      class="add-info__modal"
      :class="{
        'add-info__modal_mobile':isMobileSize
      }"
      @click.stop
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
            'menu__item-icon_not-selected': isMenuItemNotMutedOrPinned(item.action)
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

        {{ item.title }}
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
        <component
          :is="getIconComponent(item.icon)"
          :class="{
            'details-menu__item-icon':item.icon !== 'delete-icon'
          }"
        />

        <div>{{ showModalMenuItemTitle(openModalChatData, item) }}</div>
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

        <div>{{ showModalMenuItemTitle(openModalChatData, lastDetailedInfoMenuItem) }}</div>
      </div>
    </div>
    <div
      v-if="!isMobileSize"
      class="details-menu__bg-padding"
    />
  </div>
</template>

<style scoped lang="scss">
@import './AdditionalInfoModal';
</style>
