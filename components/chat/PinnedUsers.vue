<script setup lang="ts">

import UserChat from '~/components/chat/UserChat.vue'

interface PropsType {
  pinnedUsers: any[]
}

const props = defineProps<PropsType>()
const { pinnedUsers } = toRefs(props)

</script>

<template>
  <div class="pinned">
    <UserChat
      v-for="user in pinnedUsers"
      :user-data="user"
    />
  </div>
</template>

<style scoped>
.pinned {
  background-color: #eeeff1;
  border-radius: 9px;
}
</style>
