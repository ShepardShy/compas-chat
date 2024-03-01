<script setup lang="ts">
import { chatMenuItems } from '~/shared/const'

import { useUsersStore } from '~/store/users'
import MuteOffIcon from '~/assets/icons/mute-off-icon.svg'
import MuteIcon from '~/assets/icons/mute-icon.svg'
import PinIcon from '~/assets/icons/pin-icon.svg'
import type { ChatMenuType } from '~/types/messages'
import { useSettingsStore } from '~/store/settings'
import { getDistanceToViewport } from '~/composables/chats'

interface PropsType {
  chatId: number | string | undefined
  isPinned: boolean
  isMutedOff: boolean
  isUserChatLeft?: boolean
  isGroupChat: boolean
}

const props = defineProps<PropsType>()
const { chatId, isPinned, isMutedOff, isUserChatLeft, isGroupChat } = toRefs(props)

const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

const emit = defineEmits<{
  (emit: 'closeChat'): void
}>()

const usersStore = useUsersStore()
const activeMenuItem = ref<string>()

const onClickDoMenuAction = async (menuItem: ChatMenuType) => {
  activeMenuItem.value = menuItem.title

  switch (menuItem.action) {
    case 'pinChat': {
      await usersStore.togglePinUser(chatId.value!)
      break
    }
    case 'detailedChatInfo': {
      usersStore.$patch(state => state.chatIdForOpenModal = chatId.value)
      usersStore.$patch(state => state.isDetailedInfoModalOpen = true)
      break
    }
    case 'editChat': {
      usersStore.$patch(state => state.chatIdForOpenModal = chatId.value)
      usersStore.$patch(state => state.isGroupChatEditModalOpen = true)
      break
    }
    case 'deleteChat': {
      await usersStore.deleteChat(chatId.value!)
      settingsStore.$patch(state => state.isChatsShown = true)
      emit('closeChat')
      break
    }
    case 'muteChat': {
      await usersStore.toggleUserMuted(chatId.value!)
      break
    }
  }
}

const showMenuItem = (menuItem: ChatMenuType) => {
  // if (menuItem.action === 'pinChat') {
  //   return !isPinned.value ? menuItem.title : menuItem.alternativeTitle
  // } else if (menuItem.action === 'muteChat') {
  //   return !isMutedOff.value ? menuItem.title : menuItem.alternativeTitle
  // }

  return menuItem.title
}

useEventListener(document, 'contextmenu', (event) => {
  event.preventDefault()
})

const chatItems = computed(() => {
  if (isGroupChat.value) {
    return chatMenuItems
  } else {
    return chatMenuItems.filter(menuItems => menuItems.action !== 'editChat')
  }
})
</script>

<template>
  <div
    class="menu"
    :class="{
      'menu_mobile': isMobileSize
    }"
  >
    <div
      v-for="item in chatItems"
      :key="item.title"
      class="menu__item"
      :class="{
        'menu__item_active': item.title === activeMenuItem,
      }"
      @click="onClickDoMenuAction(item)"
    >
      <div
        v-if="item.icon"
        class="menu__item-icon"
        :class="{
          'menu__item-icon_not-selected': (item.action == 'muteChat' && !isMutedOff) || (item.action == 'pinChat' && !isPinned)
        }"
      >
        <MuteOffIcon
          v-if="item.action == 'muteChat' && isMutedOff"
          class="menu__item-img"
        />

        <PinIcon
          v-if="item.action == 'pinChat' && isPinned"
          class="menu__item-img"
        />
      </div>

      {{ showMenuItem(item) }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './ChatMenu.scss';
</style>
