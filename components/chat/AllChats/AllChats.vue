<script setup lang="ts">
import {
  ChatsWithoutPinnedUsers,
  ChatsWithPinnedUsers,
  ChatInput
} from '~/components'

import AppH1 from '~/components/ui/AppH1/AppH1.vue'
import CrossIcon from 'assets/icons/cross-icon.svg'

import { createChatMenu } from '~/shared'
import { useSettingsStore } from '~/store/settings'
import { useChatsStore } from '~/store/chats'

/**
 * Подключение стора с сообщениями
 */
const chatsStore = useChatsStore()
const { chatsWithPinnedUsers, chatsWithoutPinned } = storeToRefs(chatsStore)

/**
 * Подключение стора с настройками
 */
const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

/**
 * Значение инпута для поиска чата
 */
const searchChatValue = ref<string | undefined>()
/**
 * Открыто ли меню создания группового чата
 */
const isCreateChatMenuOpen = ref(false)

/**
 * Подписка на поиск чата
 */
watch(
  () => searchChatValue.value,
  async () => {
    await chatsStore.filterChats(searchChatValue.value)
  }
)

/**
 * Открытие/закрытие меню создания чата
 */
const toggleAllChatsMenu = () => isCreateChatMenuOpen.value = !isCreateChatMenuOpen.value
/**
 * Открытие модалки для создания группового чата
 */
const openModalToCreateChat = () => {
  chatsStore.$patch(state => state.isGroupChatCreateModalOpen = true)
  toggleAllChatsMenu()
}
</script>

<template>
  <div
    class="chats"
    :class="{
      'chats_mobile': isMobileSize
    }"
  >
    <div
      class="chats__head"
      :class="{
        'chats__head_mobile': isMobileSize
      }"
    >
      <AppH1 class="chats__title">
        Чат
      </AppH1>
      <CrossIcon
        class="chats__add-chat"
        @click.prevent="toggleAllChatsMenu"
      />

      <div
        v-if="isCreateChatMenuOpen"
        class="chats__menu-bg"
        @click="toggleAllChatsMenu"
      />

      <div
        v-if="isCreateChatMenuOpen"
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
      v-model:inputValue="searchChatValue"
      class="chats__input"
      placeholder="Поиск"
    />

    <div class="chats__wrapper">
      <ChatsWithPinnedUsers
        v-if="chatsWithPinnedUsers.length"
        :chats-with-pinned-users="chatsWithPinnedUsers"
        class="chats__pinned"
      />

      <ChatsWithoutPinnedUsers
        v-if="chatsWithoutPinned.length"
        :chats-without-pinned-users="chatsWithoutPinned"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './AllChats';
</style>
