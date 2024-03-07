<script setup lang="ts">
import AppH1 from '~/components/ui/AppH1/AppH1.vue'
import CrossIcon from 'assets/icons/cross-icon.svg'
import ChatInput from '~/components/chat/ui/ChatInput.vue'
import ChatsWithPinnedUsers from '~/components/chat/AllChats/ChatsWithPinnedUsers/ChatsWithPinnedUsers.vue'
import ChatsWithoutPinnedUsers from '~/components/chat/AllChats/ChatsWithoutPinnedUsers/ChatsWithoutPinnedUsers.vue'
import { useUsersStore } from '~/store/users'
import { createChatMenu } from '~/shared/const'

const usersStore = useUsersStore()
const { chatsWithPinnedUsers, chatsWithoutPinned } = storeToRefs(usersStore)

const searchUserValue = ref<string | undefined>()

watch(
  () => searchUserValue.value,
  async () => {
    await usersStore.filterChats(searchUserValue.value)
  }
)

const isAllChatsMenuOpen = ref(false)
const toggleAllChatsMenu = () => isAllChatsMenuOpen.value = !isAllChatsMenuOpen.value

const openModalToCreateChat = () => {
  usersStore.$patch(state => state.isGroupChatCreateModalOpen = true)
  toggleAllChatsMenu()
}
</script>

<template>
  <div class="users">
    <div class="users__wrapper">
      <div class="users__head">
        <AppH1 class="users__title">
          Чат
        </AppH1>
        <CrossIcon
          class="users__add-chat"
          @click="toggleAllChatsMenu"
        />

        <div
          v-if="isAllChatsMenuOpen"
          class="chats__menu-bg"
          @click="toggleAllChatsMenu"
        />

        <div
          v-if="isAllChatsMenuOpen"
          class="chats__menu"
        >
          <div
            v-for="item in createChatMenu"
            class="chats__menu-item"
            @click="openModalToCreateChat"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <ChatInput
        v-model:inputValue="searchUserValue"
        class="users__input"
        placeholder="Поиск"
      />

      <div class="chats__wrapper">
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
  </div>
</template>

<style scoped lang="scss">
@import './AllChats';
</style>
