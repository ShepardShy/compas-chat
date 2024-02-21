<script setup lang="ts">
import ChatInput from '~/components/chat/ui/ChatInput.vue'
import SendMsgIcon from '~/assets/icons/send-msg-icon.svg'
import MicrophoneIcon from '~/assets/icons/microphone-icon.svg'
import {useUsersStore} from '~/store/users'
import OwnMessage from '~/components/chat/OwnMessage/OwnMessage.vue'
import OtherMessage from '~/components/chat/OtherMessage/OtherMessage.vue'

const usersStore = useUsersStore()
const {openedChatData, userId, openedChatId} = storeToRefs(usersStore)

const messageValue = ref<string>()

const messageType = ref<'text' | 'voice'>('text')
const setMessageType = () => {
  if (messageType.value === 'text') {
    messageType.value = 'voice'
  } else if (messageType.value === 'voice') {
    messageType.value = 'text'
  }
}

const $dialogBody = ref<HTMLDivElement>();
const $dialogWrapper = ref<HTMLDivElement>();
const $dialogActions = ref<HTMLDivElement>();

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

const dialogWrapperHeight = ref()

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
        class="dialog__wrapper"
        :class="{
          'dialog__wrapper_flex': isDialogBodyHeightsLessThenVH
        }"
        ref="$dialogWrapper"
    >
      <div
          class="dialog__body"
          ref="$dialogBody"
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
        class="dialog__actions"
        ref="$dialogActions"
    >
      <ChatInput
          v-model:input-value="messageValue"
          placeholder="Напишите сообщение…"
          :add-documents="true"
          style="flex: 1 1 auto"
      />

      <div
          class="dialog__send-msg"
          @dblclick="setMessageType"
      >
        <SendMsgIcon v-if="messageType === 'text'"/>
        <MicrophoneIcon v-if="messageType === 'voice'"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './DialogBody.scss';
</style>
