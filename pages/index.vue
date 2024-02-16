<script setup lang="ts">

import { ERouteName } from '~/shared/routes'

import AllUsersChats from '~/components/chat/AllUsersChats/AllUsersChats.vue'
import ChatWindow from '~/components/chat/ChatWindow/ChatWindow.vue'

definePageMeta({
  name: ERouteName.PAGE_HOME
})

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
  width:419px;
}
</style>
