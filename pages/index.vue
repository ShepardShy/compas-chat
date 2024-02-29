<script setup lang="ts">

import { useWindowSize } from '@vueuse/core'
import { ERouteName } from '~/shared/routes'

import AllChats from '~/components/chat/AllChats/AllChats.vue'
import ChatWindow from '~/components/chat/ChatWindow/ChatWindow.vue'
import { useUsersStore } from '~/store/users'
import { useSettingsStore } from '~/store/settings'

import ChatLoader from '~/components/chat/ui/ChatLoader.vue'

definePageMeta({
  name: ERouteName.PAGE_HOME
})

const usersStore = useUsersStore()
const settingsStore = useSettingsStore()
const { isMobileSize, isChatsShown, isLoading } = storeToRefs(settingsStore)

const { width } = useWindowSize()

onMounted(() => {
  usersStore.$patch(state => state.filteredChats = state.chats)

  checkMobileSize()
  window.addEventListener('resize', checkMobileSize)
  settingsStore.$patch(state => state.isLoading = false)
})

const checkMobileSize = () => {
  settingsStore.$patch(state => state.isMobileSize = window.innerWidth < 950)
}
</script>

<template>
  <div class="app">
    <ChatLoader
      v-if="isLoading"
    />

    <div
      v-else
      class="chat"
    >
      <AllChats
        v-if="(width < 950 && isChatsShown) || !isMobileSize"
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
