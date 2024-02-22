<script setup lang="ts">
import GroupChatIcon from 'assets/icons/group-chat-icon.svg'
import UserPhoto from '~/components/chat/ChatPhoto/ChatPhoto.vue'

import {useUsersStore} from '~/store/users'

import type {GroupChatUserType} from '~/types/messages'

const usersStore = useUsersStore()
const {openedChatData} = storeToRefs(usersStore)

const userFullName = computed<string>(() => {
  if (openedChatData.value.isGroupChat) {
    return openedChatData.value.title
  } else if (openedChatData.value.firstName) {
    return openedChatData.value?.firstName + ' ' + openedChatData.value?.secondName
  } else {
    return openedChatData.value?.secondName
  }
})

const setUserFullName = (
    chatData: GroupChatUserType,
    userIdx: number | string,
    usersNumbers: number): string => {
  const fullName = chatData?.firstName
      ? chatData?.firstName + ' ' + chatData?.secondName
      : chatData?.secondName

  if (usersNumbers == userIdx + 1) {
    return fullName!
  }

  return fullName!.length ? fullName! + ', ' : fullName!
}

const setUsersQuantity = computed(() => {
      const totalChatUsers = openedChatData.value.users?.length.toString()

      if (totalChatUsers.slice(-1) === 1) {
        return `${totalChatUsers} участник`
      } else if ([2, 3, 4].includes(+totalChatUsers.slice(-1))) {
        return `${totalChatUsers} участника`
      } else {
        return `${totalChatUsers} участников`
      }
    }
)
</script>

<template>
  <div class="window__user-data">
    <UserPhoto
        :is-pinned="openedChatData.isPinned"
        :photo="openedChatData.photo"
        :is-active="openedChatData.isActive"
        :chat-name="userFullName"
        :user-id="openedChatData.id"
        :is-group-chat="openedChatData.isGroupChat"
    />

    <div class="user__user-data">
      <div class="user__name-status">
        <GroupChatIcon
            v-if="openedChatData.isGroupChat"
            class="group__title-icon"
        />

        <div class="user__name">
          {{ userFullName }}
        </div>

        <div
            v-if="!openedChatData.isGroupChat"
            class="user__status"
        >
          {{ openedChatData.isActive ? 'В сети' : 'Не в сети' }}
        </div>
      </div>

      <div
          v-if="!openedChatData.isGroupChat"
          class="user__position"
      >
        {{ openedChatData.position ?? '' }}
      </div>

      <div
          v-if="openedChatData.isGroupChat"
          class="user__chat-users"
      >
        <!--        <div-->
        <!--            v-for="(user, idx) in openedChatData.users"-->
        <!--            class="user__chat-user"-->
        <!--        >-->
        <!--          {{ setUserFullName(user, idx, openedChatData.users.length) }}-->
        <!--        </div>-->

        {{ setUsersQuantity }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './ChatWindowDialogData.scss';
</style>
