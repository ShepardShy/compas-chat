<script setup lang="ts">
import MoreIcon from '~/assets/icons/more-icon.svg'
import SearchIcon from '~/assets/icons/search-icon.svg'
import CallIcon from '~/assets/icons/call-icon.svg'

import UserPhoto from '~/components/chat/ChatPhoto/ChatPhoto.vue'
import DialogBody from '~/components/chat/DialogBody/DialogBody.vue'

import './ChatWindow.scss'

import { useUsersStore } from '~/store/users'

const usersStore = useUsersStore()
const { openedChatData } = storeToRefs(usersStore)

const userFullName = computed<string>(() => {
  if (openedChatData.value.isGroupChat) {
    return openedChatData.value.title
  } else {
    return openedChatData.value.firstName + ' ' + openedChatData.value.secondName
  }
})
</script>

<template>
  <div class="window">
    <div class="window__top">
      <div class="window__user-data">
        <UserPhoto
          :is-pinned="openedChatData.isPinned"
          :photo="openedChatData.photo"
          :is-active="openedChatData.isActive"
          :user-name="openedChatData.firstName"
          :user-id="openedChatData.id"
        />

        <div class="user__user data">
          <div class="user__name-status">
            <div class="user__name">
              {{ userFullName }}
            </div>
            <div class="user__status">
              {{ openedChatData.isActive ? 'В сети' : 'Не в сети' }}
            </div>
          </div>

          <div
            v-if="!openedChatData.isGroupChat"
            class="user__position"
          >
            {{ openedChatData.position ?? '' }}
          </div>
        </div>
      </div>

      <div class="window__actions">
        <SearchIcon />
        <CallIcon />
        <MoreIcon />
      </div>
    </div>

    <div class="window__body">
      <DialogBody />
    </div>
  </div>
</template>
