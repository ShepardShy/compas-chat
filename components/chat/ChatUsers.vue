<script setup lang="ts">

import AppH1 from '~/components/ui/AppH1/AppH1.vue'
import CrossIcon from '~/assets/icons/cross-icon.svg'
import ChatInput from '~/components/chat/ui/ChatInput.vue'
import PinnedUsers from '~/components/chat/PinnedUsers.vue'
import UsersWithoutPinned from '~/components/chat/UsersWithoutPinned.vue'
import { useUsersStore } from '~/store/users'

const usersStore = useUsersStore()
const { pinnedUsers, usersWithoutPinned } = storeToRefs(usersStore)

const searchUserValue = ref<string | undefined>()

</script>

<template>
  <div class="users">
    <div class="users__head">
      <AppH1 class="users__title">
        Чат
      </AppH1>
      <CrossIcon class="users__add-chat" />
    </div>

    <ChatInput
      v-model:search-user-value="searchUserValue"
      class="users__input"
      placeholder="Поиск"
    />

    <PinnedUsers
      v-if="pinnedUsers.length"
      :pinned-users="pinnedUsers"
      class="users__pinned"
    />

    <UsersWithoutPinned
      v-if="usersWithoutPinned.length"
      :users-without-pinned="usersWithoutPinned"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/_variables.scss' as variables;

.users {
  padding: 25px 15px;
  background-color: #fbfcfd;
}

.users__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.users__title {
  font-family: MyriadPro, sans-serif;
  color: variables.$color-black;
}

.users__add-chat {
  cursor: pointer;
}

.users__input {
  margin-bottom: 25px;
}

.users__pinned {
  margin-bottom: 10px;
}
</style>
