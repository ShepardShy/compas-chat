<script setup lang="ts">
import { useUsersStore } from '~/store/users'

interface PropsType {
  userId: number | string
  isPinned: boolean
  isActive?: boolean
  photo: string | undefined
  chatName: string
  isGroupChat: boolean
  isDetailedMenu?: boolean
}

const usersStore = useUsersStore()
const { openedChatId } = storeToRefs(usersStore)

const props = defineProps<PropsType>()
const { userId, isPinned, isActive, photo, chatName, isGroupChat, isDetailedMenu } = toRefs(props)

const activeCircleBackgroundColor = computed<string>(() => {
  if (userId.value === openedChatId.value) {
    return '#eef3f9'
  } else if (isPinned.value) {
    return '#eeeff1'
  } else {
    return '#fff'
  }
})

const chatPhoto = computed<string>(() => {
  if (photo.value) {
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
      'group__photo': isGroupChat,
      'user__photo_big': isDetailedMenu
    }"
    :style="{
      backgroundImage: chatPhoto
    }"
  >
    <div
      v-if="!photo"
      class="user__photo-name"
      :class="{
        'user__photo-name_big':isDetailedMenu
      }"
    >
      {{ chatName ? chatName[0] : '' }}
    </div>

    <div
      v-if="isActive"
      class="user__active"
      :class="{
        'user__active-big': isDetailedMenu
      }"
      :style="{
        backgroundColor: activeCircleBackgroundColor
      }"
    >
      <div
        class="user__active-circle"
        :class="{
          'user__active-circle-big':isDetailedMenu
        }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './ChatPhoto.scss';
</style>
