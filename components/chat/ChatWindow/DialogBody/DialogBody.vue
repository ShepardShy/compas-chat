<script setup lang="ts">
import { nextTick } from 'vue'
import { ChatInput, OwnMessage, OtherMessage, VoiceMessage, MessageDay, MessageInfo } from '~/components'

import SendMsgIcon from 'assets/icons/send-msg-icon.svg'
import MicrophoneIcon from 'assets/icons/microphone-icon.svg'

import { useChatsStore } from '~/store/chats'
import { useSettingsStore } from '~/store/settings'

import AppDateInput from '~/components/ui/AppInputs/Date/Date.vue'

/**
 * Подключение стора с чатами
 */
const chatsStore = useChatsStore()
const { openedChatData, userId, openedChatId } = storeToRefs(chatsStore)
/**
 * Подключение стора с настройками
 */
const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

/**
 * Тест сообщения
 */
const messageValue = ref<string>()
/**
 * Загруженные картинки
 */
const uploadedImages = ref([])
/**
 * Загруженны документы
 */
const uploadedDocuments = ref([])
/**
 * Текущий тип сообщения
 */
const messageType = ref<'text' | 'voice'>('text')
/**
 * Высота инпута изменена и не равна минимальной
 */
const isResizing = ref(false)
/**
 * Ссылка на инпут отправки сообщений
 */
const $chatInput = ref()

/**
 * Подписка на измнение чата и его очистку
 */
watch(
  () => openedChatId.value,
  async () => {
    messageValue.value = ''
    messageType.value = 'text'
    voiceMessage.value = []
    uploadedImages.value = []
    uploadedDocuments.value = []

    await checkIfDialogBodyHeightsLessThenVH()
    scrollToDialogWrapperBottom()
  })

/**
 * Монтирование компонента
 */
onMounted(async () => {
  await checkIfDialogBodyHeightsLessThenVH()
  scrollToDialogWrapperBottom()
})

/**
 * Выбрать тип сообщения через двойной клик
 */
const setMessageType = () => {
  // чтобы разделить срабатывание click и dbclick
  clearTimeout(oneClickTimer)
  clearTimeout(oneClickTimer - 1)

  if (isMakingAVoiceMessage.value) return

  if (messageType.value === 'text') {
    messageType.value = 'voice'
  } else if (messageType.value === 'voice') {
    messageType.value = 'text'
  }
}

/**
 * Проверка высоты блока с сообщениями и скролл к последнему сообщению
 */
const $dialogWrapperScroll = ref<HTMLDivElement>()
const $dialogWrapper = ref<HTMLDivElement>()
const $dialogActions = ref<HTMLDivElement>()

const isDialogBodyHeightsLessThenVH = ref(true)

const scrollToDialogWrapperBottom = () => {
  $dialogWrapper.value.scrollTop = $dialogWrapper.value.scrollHeight
}

const checkIfDialogBodyHeightsLessThenVH = async () => {
  await nextTick()

  const dialogBodyHeight = $dialogWrapperScroll.value.offsetHeight
  const dialogWrapperHeight = $dialogWrapper.value.offsetHeight

  isDialogBodyHeightsLessThenVH.value = (dialogBodyHeight < dialogWrapperHeight)
}

/**
 * Управление голосовым сообщением
 */
const isMakingAVoiceMessage = ref(false)
const voiceMessage = ref([])
let doNotSaveVoiceMessage = false

const setVoiceMessage = async (isStarted: boolean, cleanMessage: boolean = false) => {
  if (cleanMessage) {
    doNotSaveVoiceMessage = true
  }

  isMakingAVoiceMessage.value = isStarted
  await startRecord()
}

let chunks = []
let mediaRecorder = null
let audioBlob = null
let startTime
const messageDuration = ref(0)
let messageIntervalId

/**
 * Начала записи голосового сообщения
 */
async function startRecord () {
  if (!navigator.mediaDevices && !navigator.mediaDevices.getUserMedia) {
    return console.warn('Not supported')
  }

  if (!mediaRecorder) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      })
      mediaRecorder = new MediaRecorder(stream)
      mediaRecorder.start()

      startTime = new Date().getTime()

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      messageIntervalId = setInterval(() => messageDuration.value = (new Date().getTime() - startTime) / 1000, 1000)

      mediaRecorder.onstop = mediaRecorderStop
    } catch (e) {
      console.error(e)
    }
  } else {
    mediaRecorder.stop()
    clearInterval(messageIntervalId)
    messageDuration.value = 0
  }
}

/**
 * Прекращение записи голосового сообщения
 */

function mediaRecorderStop () {
  audioBlob = new Blob(chunks, { type: 'audio/mp3' })
  const src = URL.createObjectURL(audioBlob)

  if (doNotSaveVoiceMessage) {
    voiceMessage.value = []
  } else {
    voiceMessage.value = [src]
  }

  mediaRecorder = null
  chunks = []
}

/**
 * Отправить текстовое сообщение
 */
const sendTextMessage = async () => {
  chatsStore.sendTextMessage(messageValue.value, userId.value, openedChatId.value)
  messageValue.value = ''

  await nextTick()

  scrollToDialogWrapperBottom()
}

/**
 * Отправить картинку с или без комментария
 */
const sendImageMessage = async () => {
  chatsStore.sendImageMessage(uploadedImages.value, messageValue.value, userId.value, openedChatId.value)
  messageValue.value = ''
  $chatInput.value.cleanLoadedImages()

  await nextTick()

  scrollToDialogWrapperBottom()
}

let oneClickTimer

const handleMessage = () => {
  oneClickTimer = setTimeout(() => {
    if (messageType.value === 'text') {
      if (uploadedImages.value.length) {
        sendImageMessage()
        return
      }

      sendTextMessage()
    } else if (messageType.value === 'voice') {
      if (isMakingAVoiceMessage.value) {
        setVoiceMessage(false)
      } else {
        setVoiceMessage(true)
      }
    }
  }, 300)
}

/**
 * Является ли сообщение последним в своем типе (когда несколько своих подряд)
 * @param _idx
 */
const checkIfLastOfSeveralMessages = (_idx: string | number): boolean => {
  const messages = openedChatData.value!.messages
  if (messages[_idx + 1]) {
    return messages[_idx].userId !== messages[_idx + 1].userId
  } else {
    return true
  }
}
/**
 * Удалить сообщение
 * @param messageIdx
 */
const deleteMessage = (_messageIdx) => {
  voiceMessage.value = voiceMessage.value.splice(_messageIdx, -1)
}
</script>

<template>
  <div
    class="dialog"
    :class="{
      'dialog_mobile': isMobileSize
    }"
  >
    <div
      ref="$dialogWrapper"
      class="dialog__wrapper"
      :class="{
        'dialog__wrapper_flex': isDialogBodyHeightsLessThenVH,
        'dialog__wrapper_mobile': isMobileSize,
      }"
    >
      <div
        ref="$dialogWrapperScroll"
        class="dialog__wrapper-scroll"
      >
        <div
          v-for="(messagesSortedByDay, index) in openedChatData?.messages"
          :key="messagesSortedByDay.date"
          class="dialog__body"
        >
          <MessageDay
            :is-first-date="index === 0"
            :date="messagesSortedByDay.date"
          />

          <div
            v-for="(message, idx) in messagesSortedByDay?.messages"
            :key="message.id"
            class="dialog__message"
            :style="{
              alignSelf: message.type === 'message-info' ? 'center' :
                message.userId == userId ? 'flex-end' : 'flex-start',

            }"
          >
            <MessageInfo
              v-if="message.type === 'message-info'"
              :message="message"
            />

            <OwnMessage
              v-if="(message.userId === userId) && (message?.type !== 'message-info')"
              :message="message"
              :last-of-several-msgs="checkIfLastOfSeveralMessages(idx) || messagesSortedByDay?.messages.length - 1 === idx"
            />

            <OtherMessage
              v-if="(message.userId !== userId) && (message?.type !== 'message-info')"
              :message="message"
              :last-of-several-msgs="checkIfLastOfSeveralMessages(idx) || messagesSortedByDay?.messages.length - 1 === idx"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="voiceMessage.length"
      class="dialog__voice-messages"
    >
      <VoiceMessage
        class="dialog__voice"
        :is-own-message="true"
        date="12:01:2024 14:15"
        :is-received="true"
        :is-viewed="true"
        :audio-message="voiceMessage[0]"
        @delete-message="deleteMessage(0)"
      />
    </div>
    <div
      ref="$dialogActions"
      class="dialog__actions"
      :class="{
        'dialog__actions_mobile':isMobileSize
      }"
    >
      <ChatInput
        ref="$chatInput"
        v-model:input-value="messageValue"
        v-model:loaded-images="uploadedImages"
        v-model:loaded-documents="uploadedDocuments"
        v-model:is-resizing="isResizing"
        class="dialog__input"
        placeholder="Напишите сообщение…"
        :add-documents="true"
        :is-making-a-voice-message="isMakingAVoiceMessage"
        :message-duration="messageDuration"
        :is-height-resize="true"
      />

      <div
        class="dialog__send-msg"
        :class="{
          'dialog__send-msg_active': isMakingAVoiceMessage,
        }"
        @dblclick="setMessageType"
        @click="handleMessage"
      >
        <SendMsgIcon v-if="messageType === 'text' || isMakingAVoiceMessage" />

        <MicrophoneIcon v-if="messageType === 'voice' && !isMakingAVoiceMessage" />
      </div>
    </div>

    <div
      v-if="isMakingAVoiceMessage"
      class="dialog__voice-bg"
      @click="setVoiceMessage(false, true)"
    />

    <!--    <AppDateInput-->
    <!--      style="position: absolute"-->
    <!--      :item="{-->
    <!--        id: 0,-->
    <!--        required: true,-->
    <!--        substring: null,-->
    <!--        type: 'date',-->
    <!--        title: 'Дата',-->
    <!--        placeholder: '..____,',-->
    <!--        value: null,-->
    <!--        key: 'dateKey',-->
    <!--        focus: true,-->
    <!--      }"-->
    <!--      :is-multiple="false"-->
    <!--      :is-read-only="false"-->
    <!--    />-->
  </div>
</template>

<style scoped lang="scss">
@import 'DialogBody';
</style>
