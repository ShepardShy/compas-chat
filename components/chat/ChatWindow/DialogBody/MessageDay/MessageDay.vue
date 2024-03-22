<script setup lang="ts">

import { setMessageDay } from '~/composables/chats'
import { useSettingsStore } from '~/store/settings'

/**
 * Входящие пропсы
 */
interface PropsType {
  date: string
  isFirstDate: boolean
  dialogWrapperScrollTop: number
  dialogWrapperOffsetTop: number
  lastDate: boolean
}

const props = defineProps<PropsType>()
const { date, isFirstDate, dialogWrapperScrollTop, dialogWrapperOffsetTop, lastDate } = toRefs(props)

/**
 * Подключение стора с настройками
 */
const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

/** Блок с указанием дня */
const $messageBlock = ref<HTMLDivElement>()

/**
 * Вывод даты сообщений в подготовленном виде
 */
const preparedDay = computed(() => setMessageDay(date.value))

const dialogBody = ref()
const dialogWrapper = ref()
const topPosition = ref()

onMounted(() => {
  dialogWrapper.value = $messageBlock.value.closest('.dialog__wrapper')
  dialogBody.value = $messageBlock.value.closest('.dialog__body')

  if (dialogBody.value.offsetTop < dialogWrapper.value.offsetTop && lastDate.value) {
    topPosition.value = dialogWrapper.value.offsetTop + 'px'
  } else {
    topPosition.value = '0px'
  }
})
watch(
  () => dialogWrapperScrollTop.value,
  () => {
    requestAnimationFrame(setTopPosition)
  }
)

const setTopPosition = () => {
  if (dialogBody.value.offsetTop < dialogWrapperScrollTop.value + 81) {
    topPosition.value = dialogWrapperScrollTop.value + 81 - dialogBody.value.offsetTop.toFixed(0) + 'px'
  } else {
    topPosition.value = '0px'
  }
}
</script>

<template>
  <div
    ref="$messageBlock"
    class="message-block"
    :style="{
      marginTop: isFirstDate && '0',
      top: topPosition
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
@import './MessageDay';
</style>
