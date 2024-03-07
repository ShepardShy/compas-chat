<script setup lang="ts">

import AppH3 from '~/components/ui/AppH3/AppH3.vue'
import BackIcon from 'assets/icons/back-icon.svg'
import CloseIcon from 'assets/icons/close-icon.svg'
import ChatInput from '~/components/chat/ui/ChatInput.vue'
import GroupChatUser from '~/components/chat/DetailedInfo/GroupChatUser/GroupChatUser.vue'
import { useUsersStore } from '~/store/users'
import { useSettingsStore } from '~/store/settings'
import type { GroupChatUserType } from '~/types/messages'
import AppButton from '~/components/ui/AppButton/AppButton.vue'

const userSearchInputValue = ref()

const usersStore = useUsersStore()
const {
  allChatUsers,
  isGroupChatCreateModalOpen,
  openModalChatData,
  temporalStorageForNewGroupChat
} = storeToRefs(usersStore)

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

const allChatDataLocal = ref()

const addToGroup = (userData: GroupChatUserType) => {
  allChatDataLocal.value = {
    ...allChatDataLocal.value,
    users: [...allChatDataLocal.value.users, userData]
  }
}

const removeFromGroup = (userId: number | string) => {
  allChatDataLocal.value = {
    ...allChatDataLocal.value,
    users: allChatDataLocal.value.users.filter(user => user.id !== userId)
  }
}

onMounted(() => {
  if (isGroupChatCreateModalOpen.value) {
    allChatDataLocal.value = temporalStorageForNewGroupChat.value
  } else {
    allChatDataLocal.value = openModalChatData.value
  }
})

const saveChanges = async () => {
  await usersStore.$patch(state => state.temporalStorageForNewGroupChat = {
    ...state.temporalStorageForNewGroupChat,
    users: [...allChatDataLocal.value.users]
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
@use '~/assets/styles/_variables.scss' as variables;

.add-user {
  z-index: 1100;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
}

.add-user_mobile {
  left: 0;
  transform: translateX(0);
  width: 100vw;
  height: 100%;
}

.add-user__modal {
  background-color: variables.$color-white;
  border-radius: 15px;
  padding-right: 2px;
  padding-top: 25px;
  padding-bottom: 15px;
  border: 1px solid #979797;
  position: relative;
}

.add-user__modal_mobile {
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
  margin-bottom: 25px;
  border-bottom: 1px solid #f7f8fa;

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

.add-user__btns {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 25px;
}

.add-user__btn:first-of-type {
  background-color: #2f8cff;
  color: variables.$color-white;
}

.add-user__bg-padding {
  height: 10vh;
  background-color: transparent;
}
</style>
