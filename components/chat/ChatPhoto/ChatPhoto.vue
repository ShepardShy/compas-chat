<script setup lang="ts">

import {useUsersStore} from '~/store/users'
import './ChatPhoto.scss'

interface PropsType {
  userId: number | string
  isPinned: boolean
  isActive: boolean
  photo: string | undefined
  userName: string
  isGroupChat: boolean
}

const usersStore = useUsersStore()
const {openedChatId} = storeToRefs(usersStore)

const props = defineProps<PropsType>()
const {userId, isPinned, isActive, photo, userName, isGroupChat} = toRefs(props)

const activeCircleBackgroundColor = computed(() => {
  if (userId.value === openedChatId.value) {
    return '#eef3f9'
  } else if (isPinned.value) {
    return '#eeeff1'
  } else {
    return '#fff'
  }
})

const chatPhoto = computed(() => {
  if ( photo.value ) {
    return `url(${photo.value})`
  }

  if (isGroupChat.value) {
    return 'linear-gradient(to bottom, #aeee90 2%, #65dd78 100%)'
  } else {
    return 'linear-gradient(to bottom, #71d2fc 2%, #9490ff 100%)'
  }
})
</script>

<template>
  <div
      class="user__photo"
      :class="{
        'group__photo': isGroupChat
    }"
      :style="{
        backgroundImage: chatPhoto
    }"
  >
    <div
        v-if="!photo"
        class="user__photo-name"
    >
      {{ userName[0] }}
    </div>

    <div
        v-if="isActive"
        class="user__active"
        :style="{
        backgroundColor: activeCircleBackgroundColor
      }"
    >
      <div class="user__active-circle"/>
    </div>
  </div>
</template>
