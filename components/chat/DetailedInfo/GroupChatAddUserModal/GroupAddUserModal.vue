<script setup lang="ts">

import AppH3 from '~/components/ui/AppH3/AppH3.vue'
import BackIcon from 'assets/icons/back-icon.svg'
import CloseIcon from 'assets/icons/close-icon.svg'
import ChatInput from '~/components/chat/ui/ChatInput.vue'
import GroupChatUser from '~/components/chat/DetailedInfo/GroupChatUser/GroupChatUser.vue'
import { useUsersStore } from '~/store/users'
import { useSettingsStore } from '~/store/settings'

const userSearchInputValue = ref()

const usersStore = useUsersStore()
const { allChatUsers } = storeToRefs(usersStore)

const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

const closeModal = () => {
  usersStore.closeAddUserModal()
}

const closeAllModals = () => {
  usersStore.closeDetailedModal()
  usersStore.closeAddUserModal()
  usersStore.clearChatIdForOpenModal()
}

</script>

<template>
  <div
    class="add-user"
    :class="{
      'add-user_mobile': isMobileSize
    }"
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
        :user-data="user"
        :is-add-icon="true"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/_variables.scss' as variables;

.add-user {
  position: relative;
  width: 400px;
  background-color: variables.$color-white;
  z-index: 1200;
  border-radius: 15px;
  padding-right: 5px;
  padding-top: 25px;
  padding-bottom: 25px;
  border: 1px solid #979797;
}

.add-user_mobile {
  width: 100%;
  border: 1px solid transparent;
  border-radius: 0;
  height: 100%;
  max-height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow-y: auto;
}

.add-user__back-icon {
  position: absolute;
  height: 28px;
  top: 25px;
  left: 28px;
  cursor: pointer;
}

.add-user__close-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
}

.add-user__title {
  padding: 0px 69px 25px;
  font-size: 20px;
  font-weight: 400;
  color: variables.$color-black;
}

.add-user__search-input {
  padding: 0 25px 25px;
}

.add-user__group-users-wrapper {
  max-height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
    height: 122px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: variables.$color-blue-grey;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
}

.add-user__group-users-wrapper_mobile {
  max-height: 100%;
}
</style>
