<script setup lang="ts">
import UserChat from '~/components/chat/AllChats/UserChat/UserChat.vue'
import type { UserChatType, GroupChatType } from '~/types/messages'

import GroupChat from '~/components/chat/AllChats/GroupChat/GroupChat.vue'

interface PropsType {
  chatsWithPinnedUsers: Array< UserChatType | GroupChatType>
}

const props = defineProps<PropsType>()
const { chatsWithPinnedUsers } = toRefs(props)

</script>

<template>
  <div class="pinned">
    <div
      v-for="chat in chatsWithPinnedUsers"
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
@import 'ChatsWithPinnedUsers';
</style>
