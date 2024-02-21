<script setup lang="ts">
import AppH1 from '~/components/ui/AppH1/AppH1.vue'
import CrossIcon from 'assets/icons/cross-icon.svg'
import ChatInput from '~/components/chat/ui/ChatInput.vue'
import ChatsWithPinnedUsers from '~/components/chat/ChatsWithPinnedUsers/ChatsWithPinnedUsers.vue'
import ChatsWithoutPinnedUsers from '~/components/chat/ChatsWithoutPinnedUsers/ChatsWithoutPinnedUsers.vue'
import {useUsersStore} from '~/store/users'

const usersStore = useUsersStore()
const {chatsWithPinnedUsers, chatsWithoutPinned} = storeToRefs(usersStore)

const searchUserValue = ref<string | undefined>()

watch(
    () => searchUserValue.value,
    async () => {
      await usersStore.filterChats(searchUserValue.value)
    }
)
</script>

<template>
  <div class="users">
    <div class="users__wrapper">
      <div class="users__head">
        <AppH1 class="users__title">
          Чат
        </AppH1>
        <CrossIcon class="users__add-chat"/>
      </div>

      <ChatInput
          v-model:inputValue="searchUserValue"
          class="users__input"
          placeholder="Поиск"
      />

      <ChatsWithPinnedUsers
          v-if="chatsWithPinnedUsers.length"
          :chats-with-pinned-users="chatsWithPinnedUsers"
          class="users__pinned"
      />

      <ChatsWithoutPinnedUsers
          v-if="chatsWithoutPinned.length"
          :chats-without-pinned-users="chatsWithoutPinned"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './AllUsersChats.scss';
</style>
