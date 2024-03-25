<script setup lang="ts">
import AppH3 from '~/components/ui/AppH3/AppH3.vue'
import { useChatsStore } from '~/store/chats'
import { detailedInfoMenuItems } from '~/shared/const'
import type { DetailedInfoMenuItem } from '~/types/messages'

import DeleteIcon from 'assets/icons/delete-icon.svg'
import CloseIcon from 'assets/icons/close-icon.svg'
import GroupChatIcon from 'assets/icons/group-chat-icon.svg'
import AddUserIcon from 'assets/icons/add-user-icon.svg'

import ChatPhoto from '~/components/chat/ChatPhoto/ChatPhoto.vue'
import { useSettingsStore } from '~/store/settings'
import GroupChatUser from '~/components/chat/DetailedInfo/GroupChatUser/GroupChatUser.vue'
import ChatInput from '~/components/chat/ui/ChatInput/ChatInput.vue'
import AppButton from '~/components/ui/AppButton/AppButton.vue'
import { formattedDateToday } from '~/composables/chats'

/**
 * Подключение стора с чатами
 */
const chatsStore = useChatsStore()
const {
  openModalChatData,
  isGroupChatCreateModalOpen,
  temporalStorageForGroupChat,
  temporalStorageForDeletedUsers,
  temporalStorageForAddedUsers
} = storeToRefs(chatsStore)
/**
 * Подключение стора с настройками
 */
const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

/**
 * Поиск пользователя
 */
const userSearchValue = ref()
/**
 * Заголовок группового чата
 */
const groupTitle = ref(openModalChatData.value?.title || '')
/**
 * Фото чата
 */
const groupPhoto = ref(openModalChatData.value?.photo || '')
/**
 * Участники чата
 */
const groupUsers = ref(openModalChatData.value?.users || [])

/**
 * Количество участников группового чата
 */
const groupChatUsersTotal = computed(() => {
  if (!temporalStorageForGroupChat.value?.users.length && !isGroupChatCreateModalOpen.value) return '0 участников'

  const totalUsers = isGroupChatCreateModalOpen.value
    ? temporalStorageForGroupChat.value?.users.length
    : temporalStorageForGroupChat.value?.users.length

  const lastDigit = totalUsers.toString().slice(-1)
  if (+lastDigit === 1) {
    return totalUsers + ' ' + 'участник'
  } else if (+lastDigit >= 2 && +lastDigit <= 4) {
    return totalUsers + ' ' + 'участника'
  } else {
    return totalUsers + ' ' + 'участников'
  }
})
/**
 * Элемент меню Удалить
 */
const deleteMenuItem = computed(() => detailedInfoMenuItems[detailedInfoMenuItems.length - 1])
/**
 * Заголовок чата
 */
const chatFullName = computed<string>(() => {
  if (isGroupChatCreateModalOpen.value) {
    return ''
  }

  return openModalChatData.value.title
})
/**
 *
 */
const chatUsers = computed(() => {
  if (userSearchValue.value) {
    return temporalStorageForGroupChat.value?.users.filter(user =>
      user.firstName.toLowerCase().includes(userSearchValue.value.toLowerCase()) ||
        user.secondName.toLowerCase().includes(userSearchValue.value.toLowerCase())
    )
  }

  return temporalStorageForGroupChat.value?.users
})

/**
 * Подписка на изменение названия или фото чата
 */
watch(
  () => [groupTitle.value, groupPhoto.value],
  async () => {
    await updateTemporalStorageForGroupChat()
  }
)

/**
 * Монтирование компонента
 */
onMounted(() => {
  groupTitle.value = temporalStorageForGroupChat.value.title
  groupPhoto.value = temporalStorageForGroupChat.value.photo
  groupUsers.value = temporalStorageForGroupChat.value.users

  if (temporalStorageForDeletedUsers.value.length) {
    const _deletedUsersId = temporalStorageForDeletedUsers.value.map(user => user.id)
    groupUsers.value = temporalStorageForGroupChat.value.users.filter(user => !_deletedUsersId.includes(user.id))
  }

  if (temporalStorageForAddedUsers.value.length) {
    const _addedUsersId = temporalStorageForAddedUsers.value.map(user => user.id)
    const allChatUsersSavedLocal = [...temporalStorageForGroupChat.value.users]
    const _currentUsersId = allChatUsersSavedLocal.map(user => user.id)

    for (let i = 0; i < _addedUsersId.length; i++) {
      if (!_currentUsersId.includes(_addedUsersId[i])) {
        allChatUsersSavedLocal.push(temporalStorageForAddedUsers[i])
      }
    }

    groupUsers.value = [...allChatUsersSavedLocal]
  }
})

/**
 * Закрыть все модалки
 */
const closeModal = () => {
  chatsStore.closeGroupChatCreateModal()
  chatsStore.closeGroupChatEditModal()
  chatsStore.clearTemporalStorageForNewGroupChat()
  chatsStore.clearChatIdForOpenModal()

  chatsStore.$patch(state => state.temporalStorageForDeletedUsers = [])
  chatsStore.$patch(state => state.temporalStorageForAddedUsers = [])
}

/**
 * Удалить чат
 * @param _item
 */
const onClickDeleteChat = async (_item: DetailedInfoMenuItem) => {
  switch (_item.action) {
    case 'delete-messages': {
      await chatsStore.deleteChat(openModalChatData.value.id)
      chatsStore.clearChatIdForOpenModal()
      break
    }
  }
}
/**
 * Открыть модалку для добавления удаления пользователей
 */
const openAddUserModal = () => {
  chatsStore.$patch(state => state.isAddUserModalOpen = true)
}
/**
 * Удалить пользователя из локального хранилиша данных
 */
const deleteUserFromChatLocal = async (userId: number) => {
  await updateTemporalStorageForGroupChat(userId)
}

/**
 * Обновить локальное хранилище в сторе
 * @param userId
 */
const updateTemporalStorageForGroupChat = async (userId?: number) => {
  const _userToDelete = temporalStorageForGroupChat.value?.users.find(user => user.userId === userId)

  const actualUsers = userId
    ? temporalStorageForGroupChat.value?.users.filter(user => user.userId != userId)
    : temporalStorageForGroupChat.value?.users

  await chatsStore.updateTemporalStorageForGroupChat({
    ...temporalStorageForGroupChat.value,
    title: groupTitle.value,
    photo: groupPhoto.value,
    users: actualUsers
  })

  if (userId) {
    await chatsStore.$patch(state => state.temporalStorageForDeletedUsers = [...state.temporalStorageForDeletedUsers, _userToDelete])
  }
}

/**
 * Сохранить все изменения
 */
const saveChanges = async () => {
  if (!isGroupChatCreateModalOpen.value) {
    await chatsStore.updateGroupChat({
      ...temporalStorageForGroupChat.value,
      title: groupTitle.value,
      photo: groupPhoto.value,
      messages: addMessagesAboutDeletesAndAddedUsers()
    })

    await chatsStore.$patch(state => state.temporalStorageForDeletedUsers = [])
    await chatsStore.$patch(state => state.temporalStorageForAddeUsers = [])

    chatsStore.clearTemporalStorageForNewGroupChat()
    chatsStore.closeGroupChatEditModal()

    return
  }

  await updateTemporalStorageForGroupChat()
  settingsStore.$patch(state => state.isChatsShown = false)
  chatsStore.createGroupChat()
}

/**
 * Добавить сообщение об удаленных пользователях
 */
const addMessagesAboutDeletesAndAddedUsers = () => {
  const _messages = openModalChatData.value?.messages
  const finalMessages = [..._messages]

  // Сообщение об удалении

  if (temporalStorageForDeletedUsers.value.length) {
    const _deletedUsersListArray = temporalStorageForDeletedUsers.value.map((user) => {
      if (user?.firstName) {
        return user.firstName + ' ' + user?.secondName
      } else {
        return user?.secondName || ''
      }
    })

    const _deletedUsersList = _deletedUsersListArray.join(', ')

    const deleteMessage = _deletedUsersListArray.length > 1
      ? `Удалены из группового чата: ${_deletedUsersList}`
      : `Удалён из группвого чата: ${_deletedUsersList} `

    finalMessages.push({
      id: formattedDateToday(),
      type: 'message-info',
      message: deleteMessage,
      date: formattedDateToday()
    })
  }

  // Сообщение о добавлении
  if (temporalStorageForAddedUsers.value.length) {
    const _addedUsersListArray = temporalStorageForAddedUsers.value.map((user) => {
      if (user?.firstName) {
        return user.firstName + ' ' + user?.secondName
      } else {
        return user?.secondName || ''
      }
    })

    const _addedUsersList = _addedUsersListArray.join(', ')

    const addMessage = _addedUsersListArray.length > 1
      ? `Добавлены в групповой чат: ${_addedUsersList}`
      : `Добавлен в групповой чат: ${_addedUsersList}`

    finalMessages.push({
      id: formattedDateToday(),
      type: 'message-info',
      message: addMessage,
      date: formattedDateToday()
    })
  }

  return finalMessages
}
</script>

<template>
  <div
    class="edit-group"
    :class="{
      'edit-group_mobile':isMobileSize
    }"
  >
    <div
      class="edit-group__modal"
      :class="{
        'edit-group__modal_mobile':isMobileSize}"
      @click.stop
    >
      <CloseIcon
        class="edit-group__close-icon"
        @click="closeModal"
      />

      <AppH3 class="edit-group__title">
        {{ isGroupChatCreateModalOpen ? 'Создание группы' : 'Редактирование группы' }}
      </AppH3>

      <ChatPhoto
        v-model:group-photo="groupPhoto"
        class="edit-group__img"
        :chat-id="openModalChatData?.id"
        :is-pinned="openModalChatData?.isPinned"
        :photo="groupPhoto"
        :chat-name="chatFullName"
        :is-group-chat="true"
        :is-detailed-menu="true"
        :is-photo-can-ba-changed="true"
      />

      <ChatInput
        v-model:input-value="groupTitle"
        class="edit-group__group-title"
      />

      <div class="edit-group__group-users-data">
        <div
          class="edit-group__group-users-action edit-group__group-users-action_no-users"
          :class="{
            'edit-group__group-users-action': !temporalStorageForGroupChat.users?.length
          }"
        >
          <div class="edit-group__group-users-info">
            <GroupChatIcon />

            <div class="edit-group__group-users-total">
              {{
                `${groupChatUsersTotal} группы`
              }}
            </div>
          </div>
          <AddUserIcon
            class="edit-group__add-user"
            @click="openAddUserModal"
          />
        </div>

        <ChatInput
          v-if="temporalStorageForGroupChat?.users?.length"
          v-model:input-value="userSearchValue"
          placeholder="Найти"
          class="edit-group__user-search-input"
        />

        <div
          class="edit-group__group-users"
        >
          <GroupChatUser
            v-for="user in chatUsers"
            :key="user.id"
            :user-data="user"
            :is-delete-icon="true"
            @delete-user="deleteUserFromChatLocal(user.userId)"
          />
        </div>

        <div
          v-if="!chatUsers.length && !isGroupChatCreateModalOpen"
          class="edit-group__no-users"
        >
          Пользователь не найден
        </div>
      </div>

      <div
        v-if="!isGroupChatCreateModalOpen"
        class="edit-group__item edit-group__item_last"
        @click="onClickDeleteChat(deleteMenuItem)"
      >
        <DeleteIcon />

        <div>{{ deleteMenuItem.titleOne }}</div>
      </div>

      <div class="edit-group__btns">
        <AppButton
          class="edit-group__btn"
          @click="saveChanges"
        >
          {{ isGroupChatCreateModalOpen ? 'Создать' : 'Сохранить' }}
        </AppButton>
        <AppButton
          class="edit-group__btn"
          @click="closeModal"
        >
          Отменить
        </AppButton>
      </div>
    </div>
    <div
      v-if="!isMobileSize"
      class="edit-group__bg-padding"
    />
  </div>
</template>

<style scoped lang="scss">
@import './GroupChatCreateEditModal'
</style>
