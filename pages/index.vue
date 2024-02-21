<script setup lang="ts">

import { ERouteName } from '~/shared/routes'

import AllUsersChats from '~/components/chat/AllUsersChats/AllUsersChats.vue'
import ChatWindow from '~/components/chat/ChatWindow/ChatWindow.vue'
import { useUsersStore } from '~/store/users'

definePageMeta({
  name: ERouteName.PAGE_HOME
})

const usersStore = useUsersStore()

onMounted(() => usersStore.$patch(state => state.filteredChats = state.chats))
</script>

<template>
  <div class="chat">
    <AllUsersChats class="chat__users" />
    <ChatWindow class="chat__window" />
  </div>
</template>

<style>
.chat {
  display: flex;
}

.chat__users {
  flex: 0 0 419px;
}

.chat__window {
  flex: 1 1 auto;
}
</style>
