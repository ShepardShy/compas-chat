<script setup lang="ts">
import MoreIcon from '~/assets/icons/more-icon.svg'
import SearchIcon from '~/assets/icons/search-icon.svg'
import CallIcon from '~/assets/icons/call-icon.svg'
import BackIcon from '~/assets/icons/back-icon.svg'

import {
  DialogBody,
  ChatWindowData,
  ChatInput,
  ChatMenu
} from '~/components'

import { useChatsStore } from '~/store/chats'
import { useSettingsStore } from '~/store/settings'

/**
 * Подключение стора с чатами
 */
const chatsStore = useChatsStore()
const { openedChatId, openedChatData } = storeToRefs(chatsStore)
/**
 * Подключение стора с настройками
 */
const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

/**
 * Открыт поиск по чату
 */
const isSearchInDialogOpen = ref<boolean>(false)
/**
 * Открыто меню чата
 */
const isMenuOpen = ref<boolean>(false)
/**
 * Производится звонок
 */
const isMakingACall = ref<boolean>(false)
/**
 * Значение поиска по чату
 */
const searchInDialogValue = ref<string>()

/**
 * Подписка на открытие другого чата
 */
watch(
  () => openedChatId.value,
  () => {
    isMenuOpen.value = false
  }
)

/**
 * После монтирования компонента
 */
onMounted(
  () => {
    window.addEventListener('resize', () => {
      if (isMobileSize.value) {
        isSearchInDialogOpen.value = false
      }
    })
  }
)
/**
 * Вкл/выкл поиск по чату
 */
const toggleSearchInput = () => {
  isSearchInDialogOpen.value = !isSearchInDialogOpen.value
  isMenuOpen.value = false
  isMakingACall.value = false
}
/**
 * Открыть/закрыть меню чата
 */
const toggleMenuOpen = () => {
  isMenuOpen.value = !isMenuOpen.value
  isMakingACall.value = false
  isSearchInDialogOpen.value = false
}
/**
 * Начать/завершить звонок
 */
const toggleIsCalling = () => {
  isMakingACall.value = !isMakingACall.value
  isSearchInDialogOpen.value = false
  isMenuOpen.value = false
}
/**
 * Вернуться ко всем чатам (мобильная версия)
 */
const openAllChats = () => {
  settingsStore.$patch(state => state.isChatsShown = true)
  settingsStore.$patch(state => state.chatIdForOpenModal = undefined)
}
</script>

<template>
  <div class="window">
    <div
      ref="$dialogHeadHeight"
      class="window__top"
      :class="{
        'window__top_mobile': isMobileSize
      }"
    >
      <BackIcon
        v-if="isMobileSize"
        class="window__back-icon"
        :class="{
          'window__back-icon_mobile': isMobileSize
        }"
        @click="openAllChats"
      />

      <div class="window__user-data">
        <ChatWindowData v-if="!isSearchInDialogOpen" />
        <ChatInput
          v-if="isSearchInDialogOpen && !isMobileSize"
          v-model:input-value="searchInDialogValue"
          placeholder="Поиск по чату"
          width="100%"
        />
      </div>

      <div
        class="window__actions"
        :class="{
          'window__actions_mobile': isMobileSize
        }"
      >
        <SearchIcon
          v-if="!isMobileSize"
          :style="{
            color: isSearchInDialogOpen ? '#1253a2' : '#8BABD8',
          }"
          class="window__icon"
          @click="toggleSearchInput"
        />
        <!--        <CallIcon-->
        <!--          :style="{-->
        <!--            color: isMakingACall ? '#1253a2' : '#8BABD8',-->
        <!--          }"-->
        <!--          class="window__icon"-->
        <!--          @click="toggleIsCalling"-->
        <!--        />-->
        <div
          class="window__icon-wrapper"
          @click="toggleMenuOpen"
        >
          <MoreIcon
            :style="{
              color: isMenuOpen ? '#1253a2' : '#8BABD8',
            }"
            class="window__icon"
          />
        </div>
      </div>

      <div
        v-if="isMenuOpen"
        class="window__menu-bg"
        @click="toggleMenuOpen"
      />

      <ChatMenu
        v-if="isMenuOpen"
        class="window__menu"
        :class="{
          'window__menu_modal': isMobileSize
        }"
        :chat-id="openedChatId"
        :is-pinned="openedChatData.isPinned"
        :is-muted-off="openedChatData.isMutedOff"
        :is-group-chat="openedChatData.isGroupChat"
        @close-chat="toggleMenuOpen"
      />
    </div>

    <div class="window__body">
      <DialogBody />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './ChatWindow.scss';
</style>
