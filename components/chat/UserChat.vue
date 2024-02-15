<script setup lang="ts">
import ViewedMessage from '~/assets/icons/viewed-message-icon.svg'
import ReceivedMessage from '~/assets/icons/recieved-message-icon.svg'
import PinnedIcon from '~/assets/icons/pin-icon.svg'
import { useUsersStore } from '~/store/users'

interface PropsType {
  userData: {}
}

const props = defineProps<PropsType>()
const { userData, pinned } = toRefs(props)

const usersStore = useUsersStore()
const { openedChatId } = storeToRefs(usersStore)

const userFullName = computed(() => userData.value.firstName + ' ' + userData.value.secondName)
const lastMessage = computed(() => userData.value.messages[userData.value.messages.length - 1])

const messageTimeInfo = computed(() => {
  const dateParts = lastMessage.value.date.slice(0, 10).split('.')
  const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0])
  const today = new Date()

  const timeDiff = today.getTime() - date.getTime()
  const oneDay = 24 * 60 * 60 * 1000
  const diffDays = Math.floor(timeDiff / oneDay)

  const daysOfWeek = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']

  const dayOfWeek = daysOfWeek[date.getDay()]

  if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
    return lastMessage.value.date.slice(-5)
  } else if (diffDays <= 7) {
    return dayOfWeek
  } else if (diffDays > 7) {
    return lastMessage.value.date.slice(0, 5)
  }
})

const unpinUser = async () => {
  await usersStore.unpinUser(userData.value.id)
}
</script>

<template>
  <div
    class="user"
    :class="{
      'user__chat_open': openedChatId === userData.id
    }"
  >
    <div
      class="user__photo"
      :style="{
        backgroundImage: userData.photo ? `url(${userData.photo})` : 'linear-gradient(to bottom, #71d2fc 2%, #9490ff 100%)',
      }"
    >
      <div
        v-if="!userData.photo"
        class="user__photo-name"
      >
        {{ userData.firstName[0] }}
      </div>
    </div>

    <div class="user__data">
      <div class="user__personal">
        <div class="user__full-name">
          {{ userFullName }}
        </div>

        <div class="user__message-status">
          <ViewedMessage v-if="userData.id === lastMessage.userId && lastMessage.isViewed" />
          <ReceivedMessage
            v-if="userData.id === lastMessage.userId && lastMessage.isReceived && !lastMessage.isViewed"
          />

          {{ messageTimeInfo }}
        </div>
      </div>

      <div class="user__last-message">
        <span v-if="lastMessage.userId === userData.id">
          <span class="user__user-message-last"> Вы: </span> {{ lastMessage.message }}
        </span>
        <span v-else> {{ lastMessage.message }} </span>
      </div>

      <PinnedIcon
        v-if="userData.isPinned"
        class="user__pinned"
        @click="unpinUser"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/_variables.scss' as variables;

.user {
  display: flex;
  gap: 10px;
  padding: 10px 15px;
}

.user__photo {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-image: linear-gradient(to bottom, #71d2fc 2%, #9490ff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.user__photo-name {
  font-family: VAG;
  font-size: 25px;
  color: #fff;
  font-weight: 400;
}

.user__data {
  width: calc(100% - 60px);
  position: relative;
}

.user__personal {
  width: 100%;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
}

.user__full-name {
  font-family: MyriadPro;
  font-size: 16px;
  font-weight: 400;
  width: 85%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user__message-status {
  font-family: MyriadPro;
  font-size: 12px;
  color: variables.$color-dark-grey;
  font-weight: 400;
}

.user__last-message {
  font-family: MyriadPro;
  font-size: 12px;
  color: variables.$color-dark-grey;
  font-weight: 400;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 85%;
}

.user__pinned {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.user__chat_open {
  background-color: #eef3f9;
}

.user__user-message-last{
  font-weight: 600;
  color: variables.$color-black;
}
</style>
