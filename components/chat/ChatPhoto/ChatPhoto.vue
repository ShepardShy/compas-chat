<script setup lang="ts">
import { useUsersStore } from '~/store/users'
import { useSettingsStore } from '~/store/settings'

interface PropsType {
  chatId: number | string
  isPinned?: boolean
  isActive?: boolean
  photo: string | undefined
  chatName: string
  isGroupChat: boolean
  isDetailedMenu?: boolean
  isOpenDialogImage?: boolean
}

const usersStore = useUsersStore()
const { openedChatId } = storeToRefs(usersStore)

const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

const props = defineProps<PropsType>()
const { chatId, isPinned, isActive, photo, chatName, isGroupChat, isDetailedMenu, isOpenDialogImage } = toRefs(props)

const activeCircleBackgroundColor = computed<string>(() => {
  if (isDetailedMenu.value) {
    return '#fff'
  }

  if (chatId.value === openedChatId.value) {
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
      'user__photo_big': isDetailedMenu,
      'user__photo_mobile': isMobileSize && isOpenDialogImage
    }"
    :style="{
      backgroundImage: chatPhoto
    }"
  >
    <div
      v-if="!photo"
      class="user__photo-name"
      :class="{
        'user__photo-name_big':isDetailedMenu,
        'user__photo-name_mobile': isMobileSize && isOpenDialogImage
      }"
    >
      {{ chatName ? chatName[0] : '' }}
    </div>

    <div
      v-if="isActive"
      class="user__active"
      :class="{
        'user__active-big': isDetailedMenu,
        'user__active-mobile': isMobileSize && isOpenDialogImage
      }"
      :style="{
        backgroundColor: activeCircleBackgroundColor
      }"
    >
      <div
        class="user__active-circle"
        :class="{
          'user__active-circle-big':isDetailedMenu,
          'user__active-circle-mobile':isMobileSize && isOpenDialogImage
        }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './ChatPhoto.scss';
</style>
