<script setup lang="ts">
import GroupChatIcon from 'assets/icons/group-chat-icon.svg'
import UserPhoto from '~/components/chat/ChatPhoto/ChatPhoto.vue'

import { useUsersStore } from '~/store/users'
import { useSettingsStore } from '~/store/settings'

const usersStore = useUsersStore()
const { openedChatData } = storeToRefs(usersStore)

const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

const userFullName = computed<string>(() => {
  if (openedChatData.value.isGroupChat) {
    return openedChatData.value.title
  } else if (openedChatData.value.firstName) {
    return openedChatData.value?.firstName + ' ' + openedChatData.value?.secondName
  } else {
    return openedChatData.value?.secondName
  }
})

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
      :chat-id="openedChatData.id"
      :is-group-chat="openedChatData.isGroupChat"
      :is-open-dialog-image="true"
    />

    <div class="user__user-data">
      <div
        class="user__name-status"
        :class="{
          'user__name-status_mobile': isMobileSize
        }"
      >
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
        {{ setUsersQuantity }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import 'ChatWindowData';
</style>
