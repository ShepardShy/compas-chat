<script setup lang="ts">
import { nextTick } from 'vue'
import ChatInput from '~/components/chat/ui/ChatInput.vue'
import SendMsgIcon from 'assets/icons/send-msg-icon.svg'
import MicrophoneIcon from 'assets/icons/microphone-icon.svg'
import { useUsersStore } from '~/store/users'
import OwnMessage from '~/components/chat/ChatWindow/DialogBody/OwnMessage/OwnMessage.vue'
import OtherMessage from '~/components/chat/ChatWindow/DialogBody/OtherMessage/OtherMessage.vue'
import VoiceMessage from '~/components/chat/DetailedInfo/MessagesTypesModal/VoiceMessage/VoiceMessage.vue'
import { useSettingsStore } from '~/store/settings'
import MessageDay from '~/components/chat/ChatWindow/DialogBody/MessageDay/MessageDay.vue'
import AppDateInput from '~/components/ui/AppInputs/Date/AppDateInput/AppDateInput.vue'

const usersStore = useUsersStore()
const { openedChatData, userId, openedChatId } = storeToRefs(usersStore)

const settingsStore = useSettingsStore()
const { isMobileSize } = storeToRefs(settingsStore)

const messageValue = ref<string>()
const uploadedImages = ref([])
const uploadedDocuments = ref([])

const messageType = ref<'text' | 'voice'>('text')

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

const sendTextMessage = () => {
}

let oneClickTimer

const handleMessage = () => {
  oneClickTimer = setTimeout(() => {
    if (messageType.value === 'text') {
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

onMounted(async () => {
  await checkIfDialogBodyHeightsLessThenVH()
  scrollToDialogWrapperBottom()
})

watch(
  () => openedChatId.value,
  async () => {
    await checkIfDialogBodyHeightsLessThenVH()
    scrollToDialogWrapperBottom()
  }
)

const checkIfLastOfSeveralMessages = (idx: string | number): boolean => {
  const messages = openedChatData.value!.messages
  if (messages[idx + 1]) {
    return messages[idx].userId !== messages[idx + 1].userId
  } else {
    return true
  }
}

const deleteMessage = (messageIdx) => {
  voiceMessage.value = voiceMessage.value.splice(messageIdx, -1)
}

watch(
  () => openedChatId.value,
  () => {
    messageValue.value = ''
    messageType.value = 'text'
    voiceMessage.value = []
    uploadedImages.value = []
    uploadedDocuments.value = []
  })
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
        'dialog__wrapper_flex': isDialogBodyHeightsLessThenVH
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
              alignSelf: message.userId == userId ? 'flex-end' : 'flex-start',

            }"
          >
            <OwnMessage
              v-if="message.userId === userId"
              :message="message"
              :last-of-several-msgs="checkIfLastOfSeveralMessages(idx) || messagesSortedByDay?.messages.length - 1 === idx"
            />

            <OtherMessage
              v-else
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
    >
      <ChatInput
        v-model:input-value="messageValue"
        v-model:loaded-images="uploadedImages"
        v-model:loaded-documents="uploadedDocuments"
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

    <!--    <AppDateInput />-->
  </div>
</template>

<style scoped lang="scss">
@import 'DialogBody';
</style>
