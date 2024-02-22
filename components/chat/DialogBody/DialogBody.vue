<script setup lang="ts">
import ChatInput from '~/components/chat/ui/ChatInput.vue'
import SendMsgIcon from '~/assets/icons/send-msg-icon.svg'
import MicrophoneIcon from '~/assets/icons/microphone-icon.svg'
import { useUsersStore } from '~/store/users'
import OwnMessage from '~/components/chat/OwnMessage/OwnMessage.vue'
import OtherMessage from '~/components/chat/OtherMessage/OtherMessage.vue'

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

const isDialogBodyHeightsLessThenVH = ref()

const scrollToDialogWrapperBottom = () => {
  $dialogWrapper.value.scrollTop = $dialogWrapper.value.scrollHeight
}

const checkIfDialogBodyHeightsLessThenVH = async () => {
  await nextTick()
  const dialogBodyHeight = $dialogBody.value.offsetHeight
  const dialogWrapperHeight = $dialogWrapper.value.offsetHeight

  isDialogBodyHeightsLessThenVH.value = (dialogBodyHeight < dialogWrapperHeight)
}

const constraints = { audio: true, video: false }
const stream = null

const isMakingAVoiceMessage = ref(false)
const voiceMessage = ref()
const setVoiceMessage = (isStarted: boolean, cleanMessage?: boolean) => {
  isMakingAVoiceMessage.value = isStarted
  if (cleanMessage) {
    voiceMessage.value = undefined
  }
  if (isStarted) {
    // startRecord()

  }
}

let chunks = []
let mediaRecorder = null
let audioBlob = null

async function startRecord () {
  if (!navigator.mediaDevices && !navigator.mediaDevices.getUserMedia) {
    return console.warn('Not supported')
  }

  // если запись не запущена
  if (!mediaRecorder) {
    try {
      // получаем поток аудио-данных
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      })
      // создаем экземпляр `MediaRecorder`, передавая ему поток в качестве аргумента
      mediaRecorder = new MediaRecorder(stream)
      // запускаем запись
      mediaRecorder.start()
      // по окончанию записи и наличии данных добавляем эти данные в соответствующий массив
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }
      // обработчик окончания записи (см. ниже)
      mediaRecorder.onstop = mediaRecorderStop
    } catch (e) {
      console.error(e)
    }
  } else {
    // если запись запущена, останавливаем ее
    mediaRecorder.stop()
  }
}

function mediaRecorderStop () {
  // создаем объект `Blob` с помощью соответствующего конструктора,
  // передавая ему `blobParts` в виде массива и настройки с типом создаваемого объекта

  audioBlob = new Blob(chunks, { type: 'audio/mp3' })
  // метод `createObjectURL()` может использоваться для создания временных ссылок на файлы
  // данный метод "берет" `Blob` и создает уникальный `URL` для него в формате `blob:<origin>/<uuid>`
  const src = URL.createObjectURL(audioBlob)

  console.log(src)

  // выполняем очистку
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
      @click.stop="setVoiceMessage(false, true)"
    />
  </div>
</template>

<style scoped lang="scss">
@import './DialogBody.scss';
</style>
