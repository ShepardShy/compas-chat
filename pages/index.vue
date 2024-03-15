<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ERouteName } from '~/shared/routes'

import {
  AllChats,
  ChatWindow,
  ChatLoader,
  GroupAddUserModal,
  AdditionalInfoModal,
  GroupChatCreateEditModal,
  MessagesTypesModal
} from '~/components'

import { useChatsStore } from '~/store/chats'
import { useSettingsStore } from '~/store/settings'

definePageMeta({
  name: ERouteName.PAGE_HOME
})

/** Маршрутризатор */
const router = useRouter()
const route = useRoute()

/**
 * Подюклчение стора с сообщениями
 */
const chatsStore = useChatsStore()
const {
  isAddUserModalOpen,
  isDetailedInfoModalOpen,
  isGroupChatEditModalOpen,
  isGroupChatCreateModalOpen,
  isOpenMessageTypeModal,
  chats,
  openedChatId
} = storeToRefs(chatsStore)
/**
 * Подюклчение стора с настройками
 */
const settingsStore = useSettingsStore()
const { isMobileSize, isChatsShown, isLoading } = storeToRefs(settingsStore)

/**
 * Хук для отслеживания ширины экрана
 */
const { width } = useWindowSize()

/**
 * Открыта ли любая моадка
 */
const isAnyModalOpen = computed(() => {
  return isAddUserModalOpen.value ||
      isDetailedInfoModalOpen.value ||
      isGroupChatEditModalOpen.value ||
      isOpenMessageTypeModal.value ||
      isGroupChatCreateModalOpen.value
})

/**
 * Показывать ли модалку с дополнительной информацией
 */
const isAdditionalInfoModalVisible = computed(() => {
  return isDetailedInfoModalOpen.value &&
      !isAddUserModalOpen.value &&
      !isGroupChatEditModalOpen.value &&
      !isGroupChatCreateModalOpen.value &&
      !isOpenMessageTypeModal.value
})
/**
 * Высота блока в 100vh
 */
const windowHeight = computed(() => `${window.innerHeight}px`)

/**
 * Подписка на измнение открытого чата
 */
watch(
  () => openedChatId.value,
  async () => {
    if (openedChatId.value !== route.query?.chatId) {
      await router.replace({ path: '/', query: { chatId: openedChatId.value } })
    }
  }
)

/**
 * После монтирования компоненты
 */
onMounted(async () => {
  chatsStore.$patch(state => state.filteredChats = state.chats)

  checkMobileSize()
  window.addEventListener('resize', checkMobileSize)

  settingsStore.$patch(state => state.isLoading = false)

  if (route.query?.chatId) {
    await chatsStore.$patch(state => state.openedChatId = +route.query.chatId)
  } else {
    await router.replace({ path: '/', query: { chatId: chats.value[0].id } })
    chatsStore.$patch(state => state.openedChatId = chats.value[0].id)
  }
})

/**
 * Максимальная ширина экрана допустимая для мобилбной версии
 */
const maxWindowWidthForMobile = 950
/**
 * Превышает ли ширина экрана максимальную ширина экрана допустимая для мобилбной версии
 */
const checkMobileSize = () => {
  settingsStore.$patch(state => state.isMobileSize = window.innerWidth < maxWindowWidthForMobile)
}
/**
 * Закрыть все открытые моадбные окна
 * @param _event
 */
const closeAllModal = (_event: MouseEvent) => {
  _event.preventDefault()

  chatsStore.closeAddUserModal()
  chatsStore.closeDetailedModal()
  chatsStore.closeGroupChatEditModal()
  chatsStore.closeGroupChatCreateModal()
  chatsStore.closeMessageTypeModal()
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
        v-if="(width < maxWindowWidthForMobile && isChatsShown) || !isMobileSize"
        class="chat__users"
        :class="{
          'chat__users_mobile': isMobileSize
        }"
        :style="{
          height: windowHeight
        }"
      />
      <ChatWindow
        v-if="(isMobileSize && !isChatsShown) || !isMobileSize"
        class="chat__window"
        :class="{
          'chat__window_mobile': isMobileSize
        }"
        :style="{
          height: windowHeight
        }"
      />

      <div
        v-if="isAnyModalOpen"
        class="modal__bg"
        @click="closeAllModal($event)"
      >
        <div
          class="modal__bg-overlay"
          @click="closeAllModal($event)"
        >
          <div
            v-if="!isMobileSize"
            class="modal__bg-padding"
          />

          <AdditionalInfoModal
            v-if="isAdditionalInfoModalVisible"
          />
          <GroupChatCreateEditModal v-if="isGroupChatEditModalOpen && !isAddUserModalOpen" />
          <GroupChatCreateEditModal v-if="isGroupChatCreateModalOpen && !isAddUserModalOpen" />
          <GroupAddUserModal v-if="isAddUserModalOpen" />

          <MessagesTypesModal v-if="isOpenMessageTypeModal" />
        </div>
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
}

.modal__bg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(10, 13, 18, 0.2);
  z-index: 1001;
  overflow-y: auto;
}

.modal__bg-padding {
  height: 10vh;
  background-color: transparent;
}
</style>
