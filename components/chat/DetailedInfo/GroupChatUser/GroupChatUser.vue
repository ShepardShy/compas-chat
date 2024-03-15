<script setup lang="ts">
import DeleteIcon from '~/assets/icons/delete-icon.svg'
import CheckIcon from '~/assets/icons/check-icon.svg'
import type { GroupChatUserType, GroupChatType } from '~/types/messages'
import { userActiveTime } from '~/composables/chats'
import ChatPhoto from '~/components/chat/ChatPhoto/ChatPhoto.vue'
import { useChatsStore } from '~/store/chats'

/**
 * Входящие пропсы
 */
interface PropsType {
  isDeleteIcon?: boolean
  isAddIcon?: boolean
  userData: GroupChatUserType
  allChatDataLocal?: GroupChatType
}

const props = defineProps<PropsType>()
const { isDeleteIcon, isAddIcon, userData, allChatDataLocal } = toRefs(props)

/**
 * События компонента
 */
const emit = defineEmits<{
  (emit: 'delete-user'): void
  (emit: 'add-to-group', userData: GroupChatUserType): void
  (emit: 'remove-from-group', userId: number | string): void
}>()

/**
 * Подключение стора с чатама
 */
const chatsStore = useChatsStore()
const { isGroupChatCreateModalOpen } = storeToRefs(chatsStore)

/**
 * Полное имя пользователя
 */
const userFullName = computed(() => {
  if (userData.value.firstName) {
    return userData.value.firstName + ' ' + userData.value?.secondName
  } else {
    return userData.value?.secondName
  }
})

/**
 * Информация об активности пользователя
 */
const userActiveDateAndTime = computed(() => {
  if (userData.value?.isActive) {
    return 'В сети'
  } else {
    return `Был(а) в сети ${userActiveTime(userData.value?.lastTimeActive)}`
  }
})
/**
 * Находится ли пользователь уже в выбранном групповом чате
 */
const isInOpenGroup = computed(() => {
  if (!allChatDataLocal.value?.users?.length && isGroupChatCreateModalOpen.value) {
    return false
  }

  return allChatDataLocal.value?.users
    .map(user => user.id)
    .includes(userData.value.id)
})

/**
 * Добавление/удаление из группы
 */
const toggleInGroup = () => {
  if (isInOpenGroup.value) {
    removeFromGroup()
  } else {
    addToGroup()
  }
}
/**
 * Добавить в группу
 */
const addToGroup = () => {
  emit('add-to-group', userData.value)
}
/**
 * Удалить из группы
 */
const removeFromGroup = () => {
  emit('remove-from-group', userData.value.id)
}
/**
 * Удалить пользователя до сохранения
 */
const deleteUserFromGroupBeforeSave = () => emit('delete-user')
</script>

<template>
  <div class="group-chat-user">
    <div class="group-chat-user__data">
      <ChatPhoto
        :is-group-chat="false"
        :is-active="userData.isActive"
        :chat-name="userFullName"
        :photo="userData.photo"
        :chat-id="userData.id"
      />
      <div class="group-chat-user__info">
        <div class="group-chat-user__name">
          {{ userFullName }}
        </div>
        <div class="group-chat-user__active">
          {{ userActiveDateAndTime }}
        </div>
      </div>
    </div>
    <div class="action">
      <div
        v-if="isAddIcon"
        class="action__add-user"
        :class="{
          'action__add-user_active': isInOpenGroup
        }"
        @click="toggleInGroup"
      >
        <CheckIcon
          class="action__add-user-icon"
        />
      </div>
      <DeleteIcon
        v-if="isDeleteIcon"
        class="group-chat-user__delete"
        @click="deleteUserFromGroupBeforeSave"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './GroupChatUser'
</style>
