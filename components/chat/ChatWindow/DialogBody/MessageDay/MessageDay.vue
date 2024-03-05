<script setup lang="ts">

import { setMessageDay } from '~/composables/chats'

interface PropsType {
  date: string
  isFirstDate: boolean
}

const props = defineProps<PropsType>()
const { date, isFirstDate } = toRefs(props)

const preparedDay = computed(() => setMessageDay(date.value))
</script>

<template>
  <div
    class="message-block"
    :style="{
      marginTop: isFirstDate && '0'
    }"
  >
    <div
      class="message-block__wrapper"
      :class="{
        'message-block__wrapper_today': preparedDay === 'Сегодня'
      }"
    >
      <div
        class="message-block__date"
        :class="{
          'message-block__date_today' : preparedDay === 'Сегодня',
        }"
      >
        {{ preparedDay }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/_variables.scss' as variables;

.message-block {
  position: sticky;
  top: 0;
  z-index: 50;
  margin-top: 35px;
  margin-bottom: 35px;
}

.message-block__wrapper {
  display: flex;
  justify-content: center;
  position: relative;
}

.message-block__wrapper_today::before {
  content: '';
  position: absolute;
  height: 1px;
  top: 50%;
  width: calc(100vw - 387px);
  background-color: #eeeff1;
}

.message-block__date {
  cursor: pointer;
  position: relative;
  padding: 10px 16px;
  border-radius: 10px;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.03);
  border: solid 1px #eeeff1;
  font-size: 16px;
  font-weight: 400;
  color: variables.$color-dark-grey;
  background-color: variables.$color-white;
  z-index: 50;
}

.message-block__date_today {
  background-color: #2f8cff;
  color: variables.$color-white;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.03);
  border: 1px solid transparent;
}
</style>
