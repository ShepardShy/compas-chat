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
  lastDate: boolean
  shownDate: string
}

const props = defineProps<PropsType>()
const { date, isFirstDate, dialogWrapperScrollTop, lastDate } = toRefs(props)

/**
 * События
 */
const emit = defineEmits<{
  (emit: 'update:shownDate', value: string): void
}>()

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
  const nextDatePosition = dialogBody.value.nextElementSibling?.offsetTop
  const currentShownDatePosition = dialogBody.value.offsetTop
  const lastDialogBody = $messageBlock.value.closest('.dialog__body').offsetHeight

  if (dialogWrapperScrollTop.value > currentShownDatePosition &&
      (nextDatePosition && dialogWrapperScrollTop.value < (nextDatePosition - 41))) {
    emit('update:shownDate', date.value)
    return
  } else if (lastDate.value) {
    emit('update:shownDate', date.value)
  }

  // console.log((currentShownDatePosition + lastDialogBody), dialogWrapperScrollTop.value)
  // if (lastDate.value && (currentShownDatePosition + lastDialogBody) > dialogWrapperScrollTop.value) {
  //   emit('update:shownDate', date.value)
  // }

  if (dialogWrapperScrollTop.value > currentShownDatePosition &&
      (nextDatePosition && dialogWrapperScrollTop.value < nextDatePosition)) {
    emit('update:shownDate', '')
  }
}
</script>

<template>
  <div
    ref="$messageBlock"
    class="message-block"
    :style="{
      marginTop: isFirstDate && '0',
      transform: isMobileSize ? `translateX(calc(-50%))`: `translateX(calc(-50% + 40px))`,
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
