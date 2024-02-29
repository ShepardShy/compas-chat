<script setup lang="ts">
import UserChat from '~/components/chat/AllChats/UserChat/UserChat.vue'
import GroupChat from '~/components/chat/AllChats/GroupChat/GroupChat.vue'

import type { UserChatType, GroupChatType } from '~/types/messages'

interface PropsType {
  chatsWithoutPinnedUsers: Array<UserChatType | GroupChatType>
}

const props = defineProps<PropsType>()
const { chatsWithoutPinnedUsers } = toRefs(props)
</script>

<template>
  <div class="not-pinned">
    <div
      v-for="chat in chatsWithoutPinnedUsers"
      :key="chat.id"
    >
      <UserChat
        v-if="!chat.isGroupChat"
        :chat-data="chat as UserChatType"
      />

      <GroupChat
        v-if="chat.isGroupChat"
        :chat-data="chat as GroupChatType"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'ChatsWithoutPinnedUsers';
</style>
