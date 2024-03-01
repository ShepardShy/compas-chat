<script setup lang="ts">

import AppH3 from '~/components/ui/AppH3/AppH3.vue'
import { useUsersStore } from '~/store/users'
import { detailedInfoMenuItems } from '~/shared/const'
import type { DetailedInfoMenuItem, GroupChatType } from '~/types/messages'

import DeleteIcon from 'assets/icons/delete-icon.svg'
import CloseIcon from 'assets/icons/close-icon.svg'
import GroupChatIcon from 'assets/icons/group-chat-icon.svg'
import AddUserIcon from 'assets/icons/add-user-icon.svg'
import CameraIcon from 'assets/icons/camera-icon.svg'

import ChatPhoto from '~/components/chat/ChatPhoto/ChatPhoto.vue'
import { useSettingsStore } from '~/store/settings'
import GroupChatUser from '~/components/chat/DetailedInfo/GroupChatUser/GroupChatUser.vue'
import ChatInput from '~/components/chat/ui/ChatInput.vue'
import AppButton from '~/components/ui/AppButton/AppButton.vue'

const usersStore = useUsersStore()
const { openModalChatData, chats, chatIdForOpenModal } = storeToRefs(usersStore)

const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

const isGroupChat = true

const chatFullName = computed<string>(() => openModalChatData.value.title)

const closeModal = () => {
  usersStore.closeGroupChatEditModal()
  usersStore.clearChatIdForOpenModal()
}

const onClickDetailedInfoMenuItem = async (item: DetailedInfoMenuItem) => {
  switch (item.action) {
    case 'delete-messages': {
      await usersStore.deleteChat(openModalChatData.value.id)
      usersStore.clearChatIdForOpenModal()
      break
    }

    default: {
      detailedMenuActiveDataType.value = item.action
    }
  }
}

const detailedMenuActiveDataType = ref()

const groupChatUsersTotal = computed(() => {
  if (!openModalChatData.value?.users) return

  const totalUsers = openModalChatData.value?.users.length
  const lastDigit = toString().slice(-1)
  if (+lastDigit === 1) {
    return totalUsers + ' ' + 'участник'
  } else if (+lastDigit >= 2 && +lastDigit <= 4) {
    return totalUsers + ' ' + 'участника'
  } else {
    return totalUsers + ' ' + 'участников'
  }
})

const lastDetailedInfoMenuItem = computed(() => detailedInfoMenuItems[detailedInfoMenuItems.length - 1])

const openAddUserModal = () => {
  usersStore.$patch(state => state.isAddUserModalOpen = true)
}

const groupTitle = ref(openModalChatData.value?.title)

const localCopyGroupChat = ref(openModalChatData.value as GroupChatType)

const deleteUserFromChatLocal = (userId: number) => {
  localCopyGroupChat.value = {
    ...localCopyGroupChat.value,
    users: localCopyGroupChat.value.users.filter(user => user.id !== userId)
  }
}

const saveChanges = async () => {
  await usersStore.updateGroupChat({
    ...localCopyGroupChat.value,
    title: groupTitle.value
  })
  usersStore.closeGroupChatEditModal()
}

</script>

<template>
  <div
    class="edit-group__wrapper"
    :class="{
      'edit-group__modal_mobile':isMobileSize
    }"
  >
    <div
      class="edit-group__modal"
      :class="{
        'edit-group__modal_mobile':isMobileSize}"
    >
      <CloseIcon
        class="edit-group__close-icon"
        @click="closeModal"
      />

      <AppH3 class="edit-group__title">
        Редактирование группы
      </AppH3>

      <ChatPhoto
        class="edit-group__img"
        :chat-id="openModalChatData.id"
        :is-pinned="openModalChatData.isPinned"
        :is-active="openModalChatData.isActive"
        :photo="openModalChatData.photo"
        :chat-name="chatFullName"
        :is-group-chat="isGroupChat"
        :is-detailed-menu="true"
      />

      <ChatInput
        v-model:input-value="groupTitle"
        class="edit-group__group-title"
      />

      <div class="edit-group__group-users-data">
        <div class="edit-group__group-users-action">
          <div class="edit-group__group-users-info">
            <GroupChatIcon />
            <div class="edit-group__group-users-total">
              {{ `${groupChatUsersTotal} группы` }}
            </div>
          </div>
          <AddUserIcon
            class="edit-group__add-user"
            @click="openAddUserModal"
          />
        </div>
        <div
          class="edit-group__group-users"
        >
          <GroupChatUser
            v-for="user in localCopyGroupChat.users"
            :key="user.id"
            :user-data="user"
            :is-delete-icon="true"
            @delete-user="deleteUserFromChatLocal(user.id)"
          />
        </div>
      </div>

      <div
        class="edit-group__item edit-group__item_last"
        @click="onClickDetailedInfoMenuItem(lastDetailedInfoMenuItem)"
      >
        <DeleteIcon />

        <div>{{ lastDetailedInfoMenuItem.titleOne }}</div>
      </div>

      <div class="edit-group__btns">
        <AppButton
          class="edit-group__btn"
          @click="saveChanges"
        >
          Сохранить
        </AppButton>
        <AppButton
          class="edit-group__btn"
          @click="closeModal"
        >
          Отменить
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/_variables.scss' as variables;

.edit-group__modal {
  position: relative;
  width: 400px;
  background-color: variables.$color-white;
  z-index: 1100;
  border-radius: 15px;
  padding-right: 5px;
  padding-top: 25px;
  padding-bottom: 25px;
  border: 1px solid #979797;
}

.edit-group__wrapper {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100vh;

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

.edit-group__modal_mobile {
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

  &::-webkit-scrollbar {
    width: 4px;
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

.edit-group__back-icon {
  height: 25px;
  position: absolute;
  top: 25px;
  left: 10px;
  cursor: pointer;
}

.edit-group__group-title {
  margin-bottom: 20px;
  margin-right: 20px;
  margin-left: 25px;

}

.edit-group__img {
  margin: 0 auto 10px;
}

.edit-group__active {
  font-size: 12px;
  font-weight: 400;
  color: variables.$color-dark-grey;
  margin-bottom: 0px;
  text-align: center;
}

.edit-group__title {
  margin-bottom: 30px;
  text-align: left !important;
  font-size: 21px;
  font-weight: 400;
  color: variables.$color-black;
  padding-left: 25px;
}

.edit-group__participants {
  margin-bottom: 5px;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  color: variables.$color-dark-grey;
}

.edit-group__img {
  margin: 0 auto 10px;
}

.edit-group__close-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  transition: 0.3s all;
}

.edit-group__close-icon:hover {
  scale: 1.1;
}

.menu__item {
  padding: 10px 25px 10px 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: variables.$color-dark;
  display: flex;
  gap: 10px;
}

.menu__item_last {
  padding: 10px 25px 20px 25px;
}

.menu__item-icon {
  border-radius: 5px;
  background-color: #0584fe;
  width: 18px;
  height: 18px;
  margin: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-group__item {
  padding: 10px 25px;
  background-color: #f7f8fa;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  color: variables.$color-dark;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  transition: 0.2s all;
}

.edit-group__item_last {
  padding-top: 20px;
  padding-bottom: 0;
  color: variables.$color-red;
  background-color: variables.$color-white;
  margin-bottom: 25px;
}

.edit-group__group-users-data {
  margin-top: 25px;
}

.edit-group__group-users {
  max-height: 350px;
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

.edit-group__group-users-action {
  display: flex;
  padding: 20px 20px 20px 25px;
  justify-content: space-between;
  align-items: center;
  background-color: #f7f8fa;
}

.edit-group__group-users-info {
  display: flex;
  gap: 5px;
  align-items: center;
}

.edit-group__add-user {
  cursor: pointer;
}

.edit-group__btns {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 25px;
}

.edit-group__btn:first-of-type {
  background-color: #2f8cff;
  color: variables.$color-white;
}
</style>
