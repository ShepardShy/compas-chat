<script setup lang="ts">

interface PropsType {
  isOwnMessage: boolean
  isNewMessagesDate: boolean
  isNextMessageNewDate: boolean
  date: string
  isNextMessageOwn: boolean
  text: string
}

const props = defineProps<PropsType>()
const { isOwnMessage, isNewMessagesDate, date, isNextMessageOwn, text, isNextMessageNewDate } = toRefs(props)
</script>

<template>
  <div
    class="text-message"
    :class="{
      'text-message_next-new-date': isNextMessageNewDate,
      'text-message__own-message_next-own': isOwnMessage && !isNextMessageOwn,
      'text-message__other-message_next-other': !isOwnMessage && isNextMessageOwn
    }"
  >
    <div
      v-if="isNewMessagesDate"
      class="text-message__date"
    >
      {{ date.slice(0, 10) }}
    </div>

    <div
      class="text-message__message"
      :style="{
        backgroundColor: isOwnMessage ? '#dcebfc' : '#ffffff',
        alignSelf: isOwnMessage ? 'flex-end' : 'flex-start'
      }"
    >
      {{ text }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/_variables.scss' as variables;

.text-message {
  margin-left: 25px;
  margin-right: 25px;
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
}

.text-message_next-new-date,
.text-message__own-message_next-own,
.text-message__other-message_next-other {
  margin-bottom: 15px;
}

.text-message__date {
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  color: variables.$color-black;
  margin-bottom: 15px;
}

.text-message__message {
  padding: 10px;
  border-radius: 18px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.03);
  font-size: 16px;
  font-weight: 400;
  color: variables.$color-black;
  min-width: 144px;
}
</style>
