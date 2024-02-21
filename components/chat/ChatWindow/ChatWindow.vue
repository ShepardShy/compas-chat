<script setup lang="ts">
import MoreIcon from '~/assets/icons/more-icon.svg'
import SearchIcon from '~/assets/icons/search-icon.svg'
import CallIcon from '~/assets/icons/call-icon.svg'

import DialogBody from '~/components/chat/DialogBody/DialogBody.vue'

import ChatWindowDialogData from '~/components/chat/ChatWindowDialogData/ChatWindowDialogData.vue'
import ChatInput from '~/components/chat/ui/ChatInput.vue'
import ChatMenu from '~/components/chat/ChatMenu/ChatMenu.vue'
import { useUsersStore } from '~/store/users'

const usersStore = useUsersStore()
const { openedChatId, openedChatData } = storeToRefs(usersStore)

const isSearchInDialogOpen = ref<boolean>(false)
const isMenuOpen = ref<boolean>(false)
const isMakingACall = ref<boolean>(false)
const isDetailedChatOpen = ref<boolean>(false)

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
</script>

<template>
  <div class="window">
    <div
      ref="$dialogHeadHeight"
      class="window__top"
    >
      <div class="window__user-data">
        <ChatWindowDialogData v-if="!isSearchInDialogOpen" />
        <ChatInput
          v-if="isSearchInDialogOpen"
          v-model:input-value="searchInDialogValue"
          placeholder="Поиск по чату"
          width="100%"
        />
      </div>

      <div class="window__actions">
        <SearchIcon
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
        v-model:is-detailed-chat-open="isDetailedChatOpen"
        class="window__menu"
        :chat-id="openedChatId"
        :is-pinned="openedChatData.isPinned"
        :is-muted-off="openedChatData.isMutedOff"
        @close-chat="toggleMenuOpen"
      />
    </div>

    <div class="window__body">
      <DialogBody  />
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import './ChatWindow.scss';
</style>
