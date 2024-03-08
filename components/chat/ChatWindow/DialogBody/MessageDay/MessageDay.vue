<script setup lang="ts">

import { setMessageDay } from '~/composables/chats'
import { useSettingsStore } from '~/store/settings'

/**
 * Входящие пропсы
 */
interface PropsType {
  date: string
  isFirstDate: boolean
}
const props = defineProps<PropsType>()
const { date, isFirstDate } = toRefs(props)

/**
 * Подключение стора с настройками
 */
const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

/**
 * Вывод даты сообщений в подготовленном виде
 */
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
        'message-block__wrapper_today': preparedDay === 'Сегодня',
        'message-block__wrapper_mobile': isMobileSize
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
@import './MessageDay'
</style>
