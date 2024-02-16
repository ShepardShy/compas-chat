<script setup lang="ts">

import UserChat from '~/components/chat/UserChat/UserChat.vue'
import type { UserChatType, GroupChatType } from '~/types/messages'

import './ChatsWithPinnedUsers.scss'
import GroupChat from '~/components/chat/GroupChat/GroupChat.vue'

interface PropsType {
  chatsWithPinnedUsers: Array< UserChatType | GroupChatType>
}

const props = defineProps<PropsType>()
const { chatsWithPinnedUsers } = toRefs(props)

</script>

<template>
  <div class="pinned">
    <div v-for="chat in chatsWithPinnedUsers">
      <UserChat
        v-if="!chat.isGroupChat"
        :chat-data="chat as UserChatType"
      />

      <GroupChat
        v-if="chat.isGroupChat"
        :chat-data="chat as UserChatType"
      />
    </div>
  </div>
</template>
