<script setup lang="ts">
import type { MessageInfoType } from '~/types/messages'

/**
 * Входящие пропсы
 */
interface PropsType {
  message: MessageInfoType
}
const props = defineProps<PropsType>()
const { message } = storeToRefs(props)
</script>

<template>
  <div class="message-info">
    {{ message.message }}
  </div>
</template>

<style scoped lang="scss">
@import 'MessageInfo'
</style>
