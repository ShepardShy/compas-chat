<script setup lang="ts">
import { chatMenuItems } from '~/shared/const'

import { useUsersStore } from '~/store/users'
import MuteOffIcon from '~/assets/icons/mute-off-icon.svg'
import MuteIcon from '~/assets/icons/mute-icon.svg'
import PinIcon from '~/assets/icons/pin-icon.svg'
import type { ChatMenuType } from '~/types/messages'
import UserAdditionalInfoModal from '~/components/chat/DetailedInfo/UserAdditionalInfoModal/UserAdditionalInfoModal.vue'
import { useSettingsStore } from '~/store/settings'

interface PropsType {
  isDetailedChatOpen: boolean
  chatId: number | string | undefined
  isPinned: boolean
  isMutedOff: boolean
  isUserChatLeft?: boolean
}

const props = defineProps<PropsType>()
const { isDetailedChatOpen, chatId, isPinned, isMutedOff, isUserChatLeft } = toRefs(props)

const settingsStore = useSettingsStore()

const emit = defineEmits<{
  (emit: 'update:isDetailedChatOpen', value: boolean): void
  (emit: 'closeChat'): void
}>()

const usersStore = useUsersStore()

const activeMenuItem = ref<string>()

const onClickDoMenuAction = async (menuItem: ChatMenuType) => {
  activeMenuItem.value = menuItem.title
  switch (menuItem.action) {
    case 'detailedChatInfo': {
      usersStore.$patch(state => state.chatIdForOpenModal = chatId)
      toggleDetailedModalOpen()
      emit('update:isDetailedChatOpen', !isDetailedChatOpen.value)
      break
    }
    case 'editChat': {
      console.log('edit chat')
      isUserChatLeft.value && emit('update:isDetailedChatOpen', !isDetailedChatOpen.value)
      break
    }
    case 'deleteChat': {
      await usersStore.deleteChat(chatId.value!)
      settingsStore.$patch(state => state.isChatsShown = true)
      emit('closeChat')
      isUserChatLeft.value && emit('update:isDetailedChatOpen', !isDetailedChatOpen.value)
      break
    }
    case 'muteChat': {
      await usersStore.toggleUserMuted(chatId.value!)
      isUserChatLeft.value && emit('update:isDetailedChatOpen', !isDetailedChatOpen.value)
      break
    }
    case 'pinChat': {
      await usersStore.togglePinUser(chatId.value!)
      isUserChatLeft.value && emit('update:isDetailedChatOpen', !isDetailedChatOpen.value)
      break
    }
  }
}

const showMenuItem = (menuItem: ChatMenuType) => {
  if (menuItem.action === 'pinChat') {
    return !isPinned.value ? menuItem.title : menuItem.alternativeTitle
  } else if (menuItem.action === 'muteChat') {
    return !isMutedOff.value ? menuItem.title : menuItem.alternativeTitle
  }

  return menuItem.title
}

useEventListener(document, 'contextmenu', (event) => {
  event.preventDefault()
})

const isDetailedModalOpen = ref(false)
const toggleDetailedModalOpen = () => isDetailedModalOpen.value = !isDetailedModalOpen.value
</script>

<template>
  <div class="menu">
    <div
      v-for="item in chatMenuItems"
      :key="item.title"
      class="menu__item"
      :class="{
        'menu__item_active': item.title === activeMenuItem
      }"
      @click="onClickDoMenuAction(item)"
    >
      <div
        v-if="item.icon"
        class="menu__item-icon"
      >
        <MuteOffIcon
          v-if="item.action == 'muteChat' && !isMutedOff"
          class="menu__item-img"
        />

        <MuteIcon
          v-if="item.action == 'muteChat' && isMutedOff"
          class="menu__item-img"
        />

        <PinIcon
          v-if="item.action == 'pinChat'"
          class="menu__item-img"
        />
      </div>

      {{ showMenuItem(item) }}
    </div>

    <UserAdditionalInfoModal
      v-if="isDetailedModalOpen"
      v-model:is-detailed-modal-open="isDetailedModalOpen"
    />
  </div>
</template>

<style scoped lang="scss">
@import './ChatMenu.scss';
</style>
