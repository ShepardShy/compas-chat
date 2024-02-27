<script setup lang="ts">

import { ERouteName } from '~/shared/routes'

import AllUsersChats from '~/components/chat/AllUsersChats/AllUsersChats.vue'
import ChatWindow from '~/components/chat/ChatWindow/ChatWindow.vue'
import { useUsersStore } from '~/store/users'
import { useSettingsStore } from '~/store/settings'

definePageMeta({
  name: ERouteName.PAGE_HOME
})

const usersStore = useUsersStore()
const settingsStore = useSettingsStore()
const { isMobileSize, isChatsShown } = storeToRefs(settingsStore)

onMounted(() => {
  usersStore.$patch(state => state.filteredChats = state.chats)
  checkMobileSize()
  window.addEventListener('resize', checkMobileSize)
})

const checkMobileSize = () => {
  settingsStore.$patch(state => state.isMobileSize = window.innerWidth < 950)
}

</script>

<template>
  <div class="chat">
    <AllUsersChats
      v-if="(isMobileSize && isChatsShown) || !isMobileSize"
      class="chat__users"
      :class="{
        'chat__users_mobile': isMobileSize
      }"
    />
    <ChatWindow
      v-if="(isMobileSize && !isChatsShown) || !isMobileSize"
      class="chat__window"
      :class="{
        'chat__window_mobile': isMobileSize
      }"
    />
  </div>
</template>

<style>
.chat {
  display: flex;
}

.chat__users {
  flex: 0 0 419px;
}

.chat__users_mobile {
  flex: 0 0 100%;
}

.chat__window {
  flex: 1 1 auto;
}

.chat__window_mobile {
  flex: 1 1 100%;
}
</style>
