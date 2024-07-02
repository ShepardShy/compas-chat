<script setup lang="ts">
	import ReceivedIcon from "assets/icons/recieved-message-icon.svg";
	import ViewedIcon from "assets/icons/viewed-message-icon.svg";
	import type { GroupChatMessageType, MessageType } from "~/types/messages";
	import { useSettingsStore } from "~/store/settings";
	import { useAudioStore } from "~/store/audio";

	interface PropsType {
		message: GroupChatMessageType | MessageType;
		otherMessage?: boolean;
	}

	const props = defineProps<PropsType>();
	const { message, otherMessage } = toRefs(props);

	const isMessageReceived = computed<boolean>(() => {
		return message.value.isReceived && !message.value.isViewed;
	});

	const settingsStore = useSettingsStore();
	const { isMobileSize } = storeToRefs(settingsStore);

	const senderFullName = computed(() => {
		if (message.value.firstName) {
			return message.value.firstName + " " + message.value?.secondName;
		}

		return message.value.secondName;
	});

	const isMessageViewed = computed<boolean>(() => message.value.isViewed);

	const $visualizationContainer = ref(null);
	const $audioElement = ref(null);

	const audioDuration = ref(0);

	const fileSizeInBytes = ref();
	const fileSizeInKilobytes = computed(() => fileSizeInBytes.value / 1024);

	const voiceMessageLengthTransformer = () => {
		if (!audioDuration.value) {
			return "00:00";
		}

		const oneMinuteInSeconds = 60;

		const messageDurationSeconds = currentCallNumber.value > 0 ? (currentCallNumber.value * speedToCallFunction).toFixed(0) : audioDuration.value.toFixed(0);

		const minutes = Math.floor(messageDurationSeconds / oneMinuteInSeconds);
		const seconds = Math.floor(messageDurationSeconds % oneMinuteInSeconds);

		let finalDuration = "";

		function addTime(time: number, isSeconds: boolean = false) {
			if (time < 10) {
				finalDuration += "0" + time;
			} else {
				finalDuration += time;
			}

			!isSeconds && (finalDuration += ":");
		}

		addTime(minutes);
		addTime(seconds, true);

		return finalDuration;
	};

	const voiceMessageLength = ref();

	let audioData;

	function visualizeAudioData() {
		const visualizationDiv = $visualizationContainer.value;
		visualizationDiv.innerHTML = "";

		const barWidth = 3;
		const barSpacing = 1;

		const maxBarHeight = 19;

		for (let i = 0; i < numBars; i++) {
			const startIndex = Math.floor((i / numBars) * audioData.length);
			const endIndex = Math.floor(((i + 1) / numBars) * audioData.length);

			let sum = 0;
			for (let j = startIndex; j < endIndex; j++) {
				sum += Math.abs(audioData[j]);
			}

			const average = sum / (endIndex - startIndex);
			let barHeight = average * 10 * 20;

			if (average >= 0 && average < 0.01) {
				barHeight = 2; // Установка высоты столбика в 2 пикселя, если значение равно 0
			}

			if (barHeight > 19) {
				barHeight = maxBarHeight;
			}

			const barWrapper = document.createElement("div");
			barWrapper.classList.add("audio-msg__bar");
			barWrapper.style.cursor = "pointer";
			barWrapper.style.height = "20px";
			barWrapper.style.display = "flex";
			barWrapper.style.alignItems = "center";
			barWrapper.style.backgroundColor = "transparent";
			barWrapper.style.width = barWidth + "px";
			const bar = document.createElement("div");
			barWrapper.append(bar);
			bar.id = String(i);
			barWrapper.addEventListener("click", e => {
				setTimeVoiceMessage(i);
				currentCallNumber.value = i;
				updateVisualizationColors();
			});
			bar.style.width = barWidth + "px";
			bar.style.height = barHeight + "px";
			bar.style.backgroundColor = "#8babd8";
			bar.style.borderRadius = "10px";
			bar.style.marginRight = barSpacing + "px";

			visualizationDiv.appendChild(barWrapper);
		}
	}

	const numBars = 64;
	const currentCallNumber = ref(0);
	let speedToCallFunction;
	let visualizationTimeoutId; // Переменная для хранения идентификатора таймера
	let isVoiceMessageShouldBeRestarted = true;

	watch(
		() => currentCallNumber.value,
		() => {
			voiceMessageLength.value = voiceMessageLengthTransformer();
		}
	);

	function updateVisualizationColors() {
		const visualizationDiv = $visualizationContainer.value;
		const bars = visualizationDiv.querySelectorAll(".audio-msg__bar div");

		bars.forEach((bar, index) => {
			if (index <= currentCallNumber.value) {
				// Закрашиваем столбики, которые уже завершены
				bar.style.backgroundColor = "#1152a1";
			} else {
				// Оставляем незавершенные столбики без цвета
				bar.style.backgroundColor = "#8babd8";
			}
		});

		if (currentCallNumber.value < numBars) {
			isVoiceMessageShouldBeRestarted = false;
			currentCallNumber.value += 1;
			visualizationTimeoutId = setTimeout(() => updateVisualizationColors(), speedToCallFunction * 1000);
		} else {
			isVoiceMessageActive.value = false;
			isVoiceMessageShouldBeRestarted = true;
		}
	}

	const isVoiceMessageActive = ref(false);
	const toggleVoiceMessageActive = () => {
		isVoiceMessageActive.value = !isVoiceMessageActive.value;
	};

	// Запуск обновления заливки фона столбиков
	const onClickStartVoiceMessage = () => {
		if (isVoiceMessageActive.value) {
			isVoiceMessageShouldBeRestarted = false;
			pauseVoiceMessage();
		} else {
			if (isVoiceMessageShouldBeRestarted) {
				currentCallNumber.value = 0;
			}
			startVoiceMessage();
		}
	};

	const audioStore = useAudioStore();
	const { pauseAudios } = audioStore;

	const setTimeVoiceMessage = time => {
		if (!isVoiceMessageActive.value) {
			currentCallNumber.value = 0;
			startVoiceMessage();
			clearTimeout(visualizationTimeoutId);
		} else {
			currentCallNumber.value = 0;
			clearTimeout(visualizationTimeoutId);
		}

		const oneBar = 100 / 64;
		const timePercents = time * oneBar;
		const duration = audioDuration.value;
		const resultTime = duration * (timePercents * 0.01);
		$audioElement.value.currentTime = resultTime;
	};

	const startVoiceMessage = () => {
		pauseAudios();
		$audioElement.value.play();
		toggleVoiceMessageActive();
		updateVisualizationColors();
	};

	const pauseVoiceMessage = () => {
		if (isVoiceMessageActive.value) {
			$audioElement.value.pause();
			toggleVoiceMessageActive();
			clearTimeout(visualizationTimeoutId);
		}
	};

	audioStore.audiosPauses.push(pauseVoiceMessage);

	onMounted(() => {
		fetch(message.value.voice[0].url)
			.then(response => response.blob())
			.then(blob => {
				fileSizeInBytes.value = blob.size;

				const reader = new FileReader();
				reader.onloadend = () => {
					const arrayBuffer = reader.result;
					const audioContext = new AudioContext();
					audioContext.decodeAudioData(arrayBuffer, audioBuffer => {
						audioData = audioBuffer.getChannelData(0);

						audioDuration.value = audioBuffer.duration;
						speedToCallFunction = audioDuration.value / numBars;

						voiceMessageLength.value = voiceMessageLengthTransformer();

						visualizeAudioData();
					});
				};
				reader.readAsArrayBuffer(blob);
			});
	});
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
					:class="{
						'audio-msg__columns_mobile': isMobileSize,
					}"
				/>

				<div class="audio-msg__info">
					<div class="audio-msg__length">{{ voiceMessageLength }},</div>
					<div class="audio-msg__weight">{{ fileSizeInKilobytes.toFixed(2) }} KB</div>
				</div>
			</div>

			<audio
				ref="$audioElement"
				style="display: none"
				class="audioElement"
				:src="message.voice![0].url"
			/>
		</div>
		<div class="audio-msg__time-status">
			<div>{{ message.date?.slice(-5) }}</div>
			<div v-if="!otherMessage">
				<ReceivedIcon
					v-if="isMessageReceived"
					style="color: #27ae60"
				/>
				<ViewedIcon
					v-if="isMessageViewed"
					style="color: #27ae60"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import url(./VoiceMessage.scss);
</style>
