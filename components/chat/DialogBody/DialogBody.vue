<script setup lang="ts">
import { nextTick } from 'vue'
import ChatInput from '~/components/chat/ui/ChatInput.vue'
import SendMsgIcon from '~/assets/icons/send-msg-icon.svg'
import MicrophoneIcon from '~/assets/icons/microphone-icon.svg'
import { useUsersStore } from '~/store/users'
import OwnMessage from '~/components/chat/OwnMessage/OwnMessage.vue'
import OtherMessage from '~/components/chat/OtherMessage/OtherMessage.vue'
import VoiceMessage from '~/components/chat/VoiceMessage/VoiceMessage.vue'

const usersStore = useUsersStore()
const { openedChatData, userId, openedChatId } = storeToRefs(usersStore)

const messageValue = ref<string>()

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

const $dialogBody = ref<HTMLDivElement>()
const $dialogWrapper = ref<HTMLDivElement>()
const $dialogActions = ref<HTMLDivElement>()

const isDialogBodyHeightsLessThenVH = ref(true)

const scrollToDialogWrapperBottom = () => {
  $dialogWrapper.value.scrollTop = $dialogWrapper.value.scrollHeight
}

const checkIfDialogBodyHeightsLessThenVH = async () => {
  await nextTick()
  const dialogBodyHeight = $dialogBody.value.offsetHeight
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
</script>

<template>
  <div class="dialog">
    <div
      ref="$dialogWrapper"
      class="dialog__wrapper"
      :class="{
        'dialog__wrapper_flex': isDialogBodyHeightsLessThenVH
      }"
    >
      <div
        ref="$dialogBody"
        class="dialog__body"
      >
        <div
          v-for="(message, idx) in openedChatData.messages"
          :key="message.id"
          class="dialog__message"
          :style="{
            alignSelf: message.userId == userId ? 'flex-end' : 'flex-start',
            marginBottom: openedChatData.messages.length - 1 === idx && '5px'
          }"
        >
          <OwnMessage
            v-if="message.userId === userId"
            :message="message"
            :last-of-several-msgs="checkIfLastOfSeveralMessages(idx)"
          />

          <OtherMessage
            v-else
            :message="message"
            :last-of-several-msgs="checkIfLastOfSeveralMessages(idx)"
          />
        </div>
      </div>
    </div>

    <VoiceMessage
      v-if="voiceMessage.length"
      class="dialog__voice"
      :is-own-message="true"
      date="12:01:2024 14:15"
      :is-received="true"
      :is-viewed="true"
      :audio-message="voiceMessage[0]"
      @delete-message="deleteMessage(0)"
    />

    <div
      ref="$dialogActions"
      class="dialog__actions"
    >
      <ChatInput
        v-model:input-value="messageValue"
        class="dialog__input"
        placeholder="Напишите сообщение…"
        :add-documents="true"
        :is-making-a-voice-message="isMakingAVoiceMessage"
        :message-duration="messageDuration"
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
  </div>
</template>

<style scoped lang="scss">
@import './DialogBody.scss';
</style>
