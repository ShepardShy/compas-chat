<script setup lang="ts">
import MoreIcon from '~/assets/icons/more-icon.svg'
import SearchIcon from '~/assets/icons/search-icon.svg'
import CallIcon from '~/assets/icons/call-icon.svg'
import BackIcon from '~/assets/icons/back-icon.svg'

import DialogBody from '~/components/chat/ChatWindow/DialogBody/DialogBody.vue'

import ChatWindowHeader from '~/components/chat/ChatWindow/ChatWindowData/ChatWindowData.vue'
import ChatInput from '~/components/chat/ui/ChatInput.vue'
import ChatMenu from '~/components/chat/ChatMenu/ChatMenu.vue'
import { useUsersStore } from '~/store/users'
import { useSettingsStore } from '~/store/settings'

const usersStore = useUsersStore()
const { openedChatId, openedChatData } = storeToRefs(usersStore)

const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

const isSearchInDialogOpen = ref<boolean>(false)
const isMenuOpen = ref<boolean>(false)
const isMakingACall = ref<boolean>(false)

const searchInDialogValue = ref<string>()

const toggleSearchInput = () => {
  isSearchInDialogOpen.value = !isSearchInDialogOpen.value
  isMenuOpen.value = false
  isMakingACall.value = false
}
const toggleMenuOpen = () => {
  isMenuOpen.value = !isMenuOpen.value
  isMakingACall.value = false
  isSearchInDialogOpen.value = false
}
const toggleIsCalling = () => {
  isMakingACall.value = !isMakingACall.value
  isSearchInDialogOpen.value = false
  isMenuOpen.value = false
}

watch(
  () => openedChatId.value,
  () => {
    isMenuOpen.value = false
  }
)

const openAllChats = () => {
  settingsStore.$patch(state => state.isChatsShown = true)
  settingsStore.$patch(state => state.chatIdForOpenModal = undefined)
}
</script>

<template>
  <div class="window">
    <div
      ref="$dialogHeadHeight"
      class="window__top"
      :class="{
        'window__top_mobile': isMobileSize
      }"
    >
      <BackIcon
        v-if="isMobileSize"
        class="window__back-icon"
        @click="openAllChats"
      />

      <div class="window__user-data">
        <ChatWindowHeader v-if="!isSearchInDialogOpen" />
        <ChatInput
          v-if="isSearchInDialogOpen"
          v-model:input-value="searchInDialogValue"
          placeholder="Поиск по чату"
          width="100%"
        />
      </div>

      <div
        class="window__actions"
        :class="{
          'window__actions_mobile': isMobileSize
        }"
      >
        <SearchIcon
          v-if="!isMobileSize"
          :style="{
            color: isSearchInDialogOpen ? '#1253a2' : '#8BABD8',
          }"
          class="window__icon"
          @click="toggleSearchInput"
        />
        <CallIcon
          :style="{
            color: isMakingACall ? '#1253a2' : '#8BABD8',
          }"
          class="window__icon"
          @click="toggleIsCalling"
        />
        <MoreIcon
          :style="{
            color: isMenuOpen ? '#1253a2' : '#8BABD8',
          }"
          class="window__icon"
          @click="toggleMenuOpen"
        />
      </div>

      <ChatMenu
        v-if="isMenuOpen"
        class="window__menu"
        :chat-id="openedChatId"
        :is-pinned="openedChatData.isPinned"
        :is-muted-off="openedChatData.isMutedOff"
        :is-group-chat="openedChatData.isGroupChat"
        @close-chat="toggleMenuOpen"
      />
    </div>

    <div class="window__body">
      <DialogBody />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './ChatWindow.scss';
</style>
