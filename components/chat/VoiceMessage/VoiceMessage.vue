<script setup lang="ts">
import ReceivedIcon from '~/assets/icons/recieved-message-icon.svg'
import ViewedIcon from '~/assets/icons/viewed-message-icon.svg'
import DeleteIcon from 'assets/icons/delete-icon.svg'

interface PropsType {
  isViewed: boolean
  isReceived: boolean
  isOwnMessage: boolean
  date: string
  audioMessage: unknown
}

const props = defineProps<PropsType>()
const { isViewed, isReceived, isOwnMessage, date, audioMessage } = toRefs(props)

const emit = defineEmits<{(emit: 'deleteMessage'): void }>()

const isMessageReceived = computed<boolean>(() => {
  return isReceived.value && !isViewed.value
})

const isMessageViewed = computed<boolean>(() => isViewed.value)

const $visualizationContainer = ref(null)
const $audioElement = ref(null)

const audioDuration = ref(0)

const fileSizeInBytes = ref()
const fileSizeInKilobytes = computed(() => fileSizeInBytes.value / 1024)

const voiceMessageLengthTransformer = () => {
  if (!audioDuration.value) {
    return '00:00'
  }

  const oneMinuteInSeconds = 60

  const messageDurationSeconds = currentCallNumber.value > 0
    ? (currentCallNumber.value * speedToCallFunction).toFixed(0)
    : audioDuration.value.toFixed(0)

  const minutes = Math.floor(messageDurationSeconds / oneMinuteInSeconds)
  const seconds = Math.floor(messageDurationSeconds % oneMinuteInSeconds)

  let finalDuration = ''

  function addTime (time: number, isSeconds: boolean = false) {
    if (time < 10) {
      finalDuration += '0' + time
    } else {
      finalDuration += time
    }

    !isSeconds && (finalDuration += ':')
  }

  addTime(minutes)
  addTime(seconds, true)

  return finalDuration
}

const voiceMessageLength = ref()

let audioData

function visualizeAudioData () {
  const visualizationDiv = $visualizationContainer.value
  visualizationDiv.innerHTML = ''

  const barWidth = 3
  const barSpacing = 1

  const maxBarHeight = 19

  for (let i = 0; i < numBars; i++) {
    const startIndex = Math.floor((i / numBars) * audioData.length)
    const endIndex = Math.floor(((i + 1) / numBars) * audioData.length)

    let sum = 0
    for (let j = startIndex; j < endIndex; j++) {
      sum += Math.abs(audioData[j])
    }

    const average = sum / (endIndex - startIndex)
    let barHeight = average * 10 * 20

    if (average >= 0 && average < 0.01) {
      barHeight = 2 // Установка высоты столбика в 2 пикселя, если значение равно 0
    }

    if (barHeight > 19) {
      barHeight = maxBarHeight
    }

    const bar = document.createElement('div')
    bar.style.width = barWidth + 'px'
    bar.style.height = barHeight + 'px'
    bar.style.backgroundColor = '#8babd8'
    bar.style.borderRadius = '10px'
    bar.style.marginRight = barSpacing + 'px'

    visualizationDiv.appendChild(bar)
  }
}

const numBars = 64
const currentCallNumber = ref(0)
let speedToCallFunction
let visualizationTimeoutId // Переменная для хранения идентификатора таймера
let isVoiceMessageShouldBeRestarted = true

watch(
  () => currentCallNumber.value,
  () => {
    voiceMessageLength.value = voiceMessageLengthTransformer()
  }
)

function updateVisualizationColors () {
  const visualizationDiv = $visualizationContainer.value
  const bars = visualizationDiv.querySelectorAll('div')

  bars.forEach((bar, index) => {
    if (index <= currentCallNumber.value) {
      // Закрашиваем столбики, которые уже завершены
      bar.style.backgroundColor = '#1152a1'
    } else {
      // Оставляем незавершенные столбики без цвета
      bar.style.backgroundColor = '#8babd8'
    }
  })

  if (currentCallNumber.value < numBars) {
    isVoiceMessageShouldBeRestarted = false
    currentCallNumber.value += 1
    visualizationTimeoutId = setTimeout(() => updateVisualizationColors(), speedToCallFunction * 1000)
  } else {
    isVoiceMessageActive.value = false
    isVoiceMessageShouldBeRestarted = true
  }
}

const isVoiceMessageActive = ref(false)
const toggleVoiceMessageActive = () => {
  isVoiceMessageActive.value = !isVoiceMessageActive.value
}

// Запуск обновления заливки фона столбиков
const onClickStartVoiceMessage = () => {
  if (isVoiceMessageActive.value) {
    isVoiceMessageShouldBeRestarted = false
    pauseVoiceMessage()
  } else {
    if (isVoiceMessageShouldBeRestarted) {
      currentCallNumber.value = 0
    }
    startVoiceMessage()
  }
}

const startVoiceMessage = () => {
  $audioElement.value.play()
  toggleVoiceMessageActive()
  updateVisualizationColors()
}

const pauseVoiceMessage = () => {
  $audioElement.value.pause()
  toggleVoiceMessageActive()
  clearTimeout(visualizationTimeoutId)
}

const deleteMessage = () => emit('deleteMessage')

onMounted(() => {
  fetch(audioMessage.value)
    .then(response => response.blob())
    .then((blob) => {
      fileSizeInBytes.value = blob.size

      const reader = new FileReader()
      reader.onloadend = () => {
        const arrayBuffer = reader.result
        const audioContext = new AudioContext()
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          audioData = audioBuffer.getChannelData(0)

          audioDuration.value = audioBuffer.duration
          speedToCallFunction = audioDuration.value / numBars

          voiceMessageLength.value = voiceMessageLengthTransformer()

          visualizeAudioData()
        })
      }
      reader.readAsArrayBuffer(blob)
    })
})
</script>

<template>
  <div class="audio-msg">
    <div class="audio-msg__body">
      <div
        class="audio-msg__btn"
        @click="onClickStartVoiceMessage"
      >
        <div
          v-if="!isVoiceMessageActive"
          class="audio-msg__triangle"
        />

        <div
          v-else
          class="audio-msg__pause"
        />
      </div>
      <div class="audio-msg__data">
        <div
          ref="$visualizationContainer"
          class="audio-msg__columns"
        />

        <div class="audio-msg__info">
          <div class="audio-msg__length">
            {{ voiceMessageLength }},
          </div>
          <div class="audio-msg__weight">
            {{ fileSizeInKilobytes.toFixed(2) }} KB
          </div>
        </div>
      </div>

      <audio
        ref="$audioElement"
        style="display: none"
        class="audioElement"
        :src="audioMessage"
      />
    </div>
    <div class="audio-msg__time-status">
      <div>{{ date?.slice(-5) }}</div>
      <div v-if="isOwnMessage">
        <ReceivedIcon v-if="isMessageReceived" />
        <ViewedIcon v-if="isMessageViewed" />
      </div>
    </div>

    <div
      class="audio-msg__delete"
      @click="deleteMessage"
    >
      <DeleteIcon class="audio-msg__delete-icon" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/_variables.scss' as variables;

.audio-msg {
  padding: 10px 15px;
  background-color: #f7f8fa;
  position: relative;
}

.audio-msg__body {
  display: flex;
  gap: 15px;
}

.audio-msg__btn {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  margin: 0 15px 0 0;
  padding: 11.7px 10.1px 11.7px 13.8px;
  background-color: #8babd8;
  border-radius: 40px;
  cursor: pointer;
  transition: 0.2s all;
  display: flex;
  justify-content: center;
  align-items: center;
}

.audio-msg__btn:active {
  opacity: 0.7;
}

.audio-msg__triangle {
  width: 16px;
  height: 16px;
  border-top: 9px solid transparent;
  border-left: 16px solid variables.$color-white;
  border-bottom: 9px solid transparent;
  border-radius: 2px;
}

.audio-msg__pause {
  position: relative;
}

.audio-msg__pause:before {
  content: '';
  position: absolute;
  top: -8px;
  width: 4px;
  height: 16px;
  border-radius: 2px;
  background-color: variables.$color-white;
}

.audio-msg__pause:after {
  content: '';
  position: absolute;
  top: -8px;
  right: 4px;
  width: 4px;
  height: 16px;
  border-radius: 2px;
  background-color: variables.$color-white;
}

.audio-msg__time-status {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
}

.audioPlayer {

}

.audio-msg__columns {
  display: flex;
  align-items: center;
  height: 20px;
  width: 220px;
  margin-bottom: 9px;
}

.audio-msg__info {
  display: flex;
  gap: 10px;
}

.audio-msg__length,
.audio-msg__weight {
  font-size: 12px;
  font-weight: 400;
  color: #8babd8;
}

.audio-msg__delete {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 25px;
  height: 25px;
  border-radius: 5px;
  background-color: variables.$color-white;
  box-shadow: 0 0 3px 0 variables.$color-black;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid variables.$color-light-grey;
  cursor: pointer;
  transition: 0.2s scale;
}

.audio-msg__delete-icon {
  color: variables.$color-red;
}

.audio-msg__delete:hover {
  scale: 1.1;
}
</style>
