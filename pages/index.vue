<script setup lang="ts">

import { useWindowSize } from '@vueuse/core'
import { ERouteName } from '~/shared/routes'

import AllChats from '~/components/chat/AllChats/AllChats.vue'
import ChatWindow from '~/components/chat/ChatWindow/ChatWindow.vue'
import { useUsersStore } from '~/store/users'
import { useSettingsStore } from '~/store/settings'

import ChatLoader from '~/components/chat/ui/ChatLoader.vue'
import GroupAddUserModal from '~/components/chat/DetailedInfo/GroupChatAddUserModal/GroupAddUserModal.vue'
import AdditionalInfoModal from '~/components/chat/DetailedInfo/AdditionalInfoModal/AdditionalInfoModal.vue'
import GroupChatEditModal from '~/components/chat/DetailedInfo/GroupChatEditModal/GroupChatEditModal.vue'
import MessagesTypesModal from '~/components/chat/DetailedInfo/MessagesTypesModal/MessagesTypesModal.vue'

definePageMeta({
  name: ERouteName.PAGE_HOME
})

const usersStore = useUsersStore()
const {
  isAddUserModalOpen,
  isDetailedInfoModalOpen,
  isGroupChatEditModalOpen,
  isOpenMessageTypeModal
} = storeToRefs(usersStore)

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
    <ChatLoader v-if="isLoading" />

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

      <div
        v-if="isAddUserModalOpen || isDetailedInfoModalOpen || isGroupChatEditModalOpen || isOpenMessageTypeModal"
        class="modal__bg"
      >
        <AdditionalInfoModal
          v-if="isDetailedInfoModalOpen && !isAddUserModalOpen && !isGroupChatEditModalOpen && !isOpenMessageTypeModal"
        />
        <GroupChatEditModal v-if="isGroupChatEditModalOpen && !isAddUserModalOpen" />
        <GroupAddUserModal v-if="isAddUserModalOpen" />

        <MessagesTypesModal v-if="isOpenMessageTypeModal" />
      </div>
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

.modal__bg {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
