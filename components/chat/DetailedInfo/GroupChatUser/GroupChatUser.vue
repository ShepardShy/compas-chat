<script setup lang="ts">
import DeleteIcon from '~/assets/icons/delete-icon.svg'
import CheckIcon from '~/assets/icons/check-icon.svg'
import type { GroupChatUserType } from '~/types/messages'
import { userActiveTime } from '~/composables/chats'
import ChatPhoto from '~/components/chat/ChatPhoto/ChatPhoto.vue'
import { useUsersStore } from '~/store/users'

interface PropsType {
  isDeleteIcon?: boolean
  isAddIcon?: boolean
  userData: GroupChatUserType
}

const props = defineProps<PropsType>()
const { isDeleteIcon, isAddIcon, userData } = toRefs(props)

const usersStore = useUsersStore()
const { chats, chatIdForOpenModal } = storeToRefs(usersStore)

const emit = defineEmits<{(emit: 'delete-user'): void }>()

const userFullName = computed(() => {
  if (userData.value.firstName) {
    return userData.value.firstName + userData.value?.secondName
  } else {
    return userData.value?.secondName
  }
})

const userActiveDateAndTime = computed(() => {
  if (userData.value.isActive) {
    return 'В сети'
  } else {
    return `Был(а) в сети ${userActiveTime(userData.value.lastTimeActive)}`
  }
})

const isInOpenGroup = computed(() => {
  return chats.value
    .find(chat => chat.isGroupChat && (chat.id === chatIdForOpenModal.value))
    .users
    .map(user => user.id)
    .includes(userData.value.id)
})

const toggleInGroup = () => {
  if (isInOpenGroup.value) {
    removeFromGroup()
  } else {
    addToGroup()
  }
}
const addToGroup = () => {
  usersStore.addToGroup(userData.value.id, chatIdForOpenModal.value)
}

const removeFromGroup = () => {
  usersStore.removeFromGroup(userData.value.id, chatIdForOpenModal.value)
}

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
@use '~/assets/styles/_variables.scss' as variables;

.group-chat-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 25px;

}

.group-chat-user__data {
  display: flex;
  gap: 10px;
  align-items: center;
}

.group-chat-user__name {
  font-size: 16px;
  font-weight: 400;
  color: variables.$color-active;
  text-decoration: underline;
  margin-bottom: 5px;
}

.group-chat-user__active {
  font-family: MyriadPro;
  font-size: 12px;
  font-weight: 400;
  color: variables.$color-dark-grey;
}

.action__add-user {
  width: 19px;
  height: 19px;
  border: 1px solid #0584fe;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s all;
}

.action__add-user_active {
  background-color: #0584fe;
  display: flex;
  justify-content: center;
  align-items: center;
}

.action__add-user-icon {
  color: variables.$color-white;
  scale: 0.7;
}

.group-chat-user__delete {
  cursor: pointer;
}
</style>
