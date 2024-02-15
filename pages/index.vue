<script setup lang="ts">

import { ERouteName } from '~/shared/routes'

import ChatUsers from '~/components/chat/ChatUsers.vue'
import ChatWindow from '~/components/chat/ChatWindow.vue'

definePageMeta({
  name: ERouteName.PAGE_HOME
})

</script>

<template>
  <div class="chat">
    <ChatUsers class="chat__users" />
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
