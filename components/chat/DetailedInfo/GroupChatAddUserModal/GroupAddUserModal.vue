<script setup lang="ts">

import AppH3 from '~/components/ui/AppH3/AppH3.vue'
import BackIcon from 'assets/icons/back-icon.svg'
import CloseIcon from 'assets/icons/close-icon.svg'
import { ChatInput, GroupChatUser } from '~/components'

import { useChatsStore } from '~/store/chats'
import { useSettingsStore } from '~/store/settings'
import type { GroupChatUserType } from '~/types/messages'
import AppButton from '~/components/ui/AppButton/AppButton.vue'

/**
 * Подключение стора с чатами
 */
const chatsStore = useChatsStore()
const {
  allChatUsers,
  temporalStorageForGroupChat
} = storeToRefs(chatsStore)
/**
 * Подключение стора с настройками
 */
const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

/**
 * Поиск пользователя
 */
const userSearchInputValue = ref()
/**
 * Докальное хранилище для чата
 */
const allChatDataLocal = ref()

/**
 * Монтирование компоненты
 */
onMounted(() => {
  allChatDataLocal.value = temporalStorageForGroupChat.value
})

/**
 * Закрыть модлаку
 */
const closeModal = () => {
  chatsStore.closeAddUserModal()
}
/**
 * Закрыть все модалки
 */
const closeAllModals = () => {
  chatsStore.closeDetailedModal()
  chatsStore.closeAddUserModal()
  chatsStore.clearChatIdForOpenModal()
}
/**
 * Добавить пользователя в локальное хранилище данных
 * @param _userData
 */
const addToGroup = (_userData: GroupChatUserType) => {
  allChatDataLocal.value = {
    ...allChatDataLocal.value,
    users: [...allChatDataLocal.value.users, _userData]
  }
}
/**
 * Убрать пользователя из локального хранилище данных
 * @param _userData
 */
const removeFromGroup = (userId: number | string) => {
  allChatDataLocal.value = {
    ...allChatDataLocal.value,
    users: allChatDataLocal.value.users.filter(user => user.id !== userId)
  }
}
/**
 * Сохранить добавление/удаление пользователей во временное хранилице в сторе
 */
const saveChanges = async () => {
  await chatsStore.$patch(state => state.temporalStorageForGroupChat = {
    ...allChatDataLocal.value
  })
  closeModal()
}
</script>

<template>
  <div
    class="add-user"
    :class="{
      'add-user_mobile':isMobileSize
    }"
  >
    <div
      class="add-user__modal"
      :class="{
        'add-user__modal_mobile': isMobileSize
      }"
      @click.stop
    >
      <BackIcon
        class="add-user__back-icon"
        @click="closeModal"
      />

      <AppH3 class="add-user__title">
        Добавить в группу
      </AppH3>

      <CloseIcon
        class="add-user__close-icon"
        @click="closeAllModals"
      />

      <ChatInput
        v-model:input-value="userSearchInputValue"
        class="add-user__search-input"
        placeholder="Найти"
      />

      <div
        class="add-user__group-users-wrapper"
        :class="{
          'add-user__group-users-wrapper_mobile': isMobileSize
        }"
      >
        <GroupChatUser
          v-for="user in allChatUsers"
          :key="user.id"
          :all-chat-data-local="allChatDataLocal"
          :user-data="user"
          :is-add-icon="true"
          @add-to-group="userData => addToGroup(userData)"
          @remove-from-group="userId => removeFromGroup(userId)"
        />
      </div>

      <div class="add-user__btns">
        <AppButton
          class="add-user__btn"
          @click="saveChanges"
        >
          Добавить
        </AppButton>
      </div>
    </div>

    <div
      v-if="!isMobileSize"
      class="add-user__bg-padding"
    />
  </div>
</template>

<style scoped lang="scss">
@import './GroupAddUserModal'
</style>
