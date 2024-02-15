<script setup lang="ts">
import UserChat from '~/components/chat/UserChat.vue'

interface PropsType {
  usersWithoutPinned: any[]
}

const props = defineProps<PropsType>()
const { usersWithoutPinned } = toRefs(props)
</script>

<template>
  <div class="not-pinned">
    <UserChat
      v-for="user in usersWithoutPinned"
      :user-data="user"
      :pinned="true"
    />
  </div>
</template>

<style scoped>
.not-pinned {

}
</style>
