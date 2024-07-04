<script setup lang="ts">
	import { nextTick } from "vue";
	import { ChatInput, OwnMessage, OtherMessage, VoiceMessageType, MessageDay, MessageInfo, DaySeparator } from "~/components";

	import SendMsgIcon from "assets/icons/send-msg-icon.svg";
	import MicrophoneIcon from "assets/icons/microphone-icon.svg";

	import { useChatsStore } from "~/store/chats";
	import { useSettingsStore } from "~/store/settings";

	import AppDateInput from "~/components/ui/AppInputs/Date/Date.vue";
	import type { GroupChatMessageType, MessageType } from "~/types/messages";
	import { setMessageDay } from "~/composables/chats";
	import type { string } from "yup";

	defineEmits(["sendVoiceMessage"]);

	/**
	 * Подключение стора с чатами
	 */
	const chatsStore = useChatsStore();
	const { openedChatData, userId, openedChatId } = storeToRefs(chatsStore);
	/**
	 * Подключение стора с настройками
	 */
	const settingsStore = useSettingsStore();
	const { isMobileSize } = storeToRefs(settingsStore);

	/**
	 * Тест сообщения
	 */
	const messageValue = ref<string>("");
	/**
	 * Загруженные картинки
	 */
	const uploadedImages = ref([]);
	/**
	 * Загруженны документы
	 */
	const uploadedDocuments = ref([]);
	/**
	 * Текущий тип сообщения
	 */
	const messageType = ref<"text" | "voice">("voice");
	/**
	 * Высота инпута изменена и не равна минимальной
	 */
	const isResizing = ref(false);
	/**
	 *
	 * Показывает скрытую дату сообщений при скролле */
	const shownDate = ref(openedChatData?.value.messages[openedChatData?.value.messages.length - 1]?.date);
	/**
	 * Отображение shownDate
	 * */
	const preparedDay = computed(() => setMessageDay(shownDate.value));
	/**
	 * Ссылка на инпут отправки сообщений
	 */
	const $chatInput = ref();
	/** Высота области с инпутом */
	const dialogActionsHeight = ref("0 0 90px");

	/** Нет данных для сообщений */
	const noMessageToSend = computed(() => !uploadedImages.value.length && !uploadedDocuments.value.length && !voiceMessage.value.length && !messageValue.value?.trim());

	/**
	 * Подписка на измнение чата и его очистку
	 */
	watch(
		() => openedChatId.value,
		async () => {
			messageType.value = "text";
			voiceMessage.value = [];
			$chatInput.value.cleanLoadedImages();
			$chatInput.value.cleanLoadedDocuments();

			await checkIfDialogBodyHeightsLessThenVH();
			scrollToDialogWrapperBottom();

			if (openedChatData.value?.textMessageDraft) {
				messageValue.value = openedChatData.value?.textMessageDraft;
			} else {
				messageValue.value = "";
			}
		}
	);
	/**
	 * Подписка на ввод ссобщения
	 */
	watch(
		() => messageValue.value,
		async () => {
			if (messageValue.value !== openedChatData.value?.textMessageDraft) {
				chatsStore.saveTextMessageDraft(openedChatId.value, messageValue.value);
			}
			if (messageValue.value.trim()) {
				messageType.value = "text";
			} else {
				messageType.value = "voice";
			}

			await nextTick();
			scrollToDialogWrapperBottom();
		}
	);
	/** Подписка на загрузку сообщений */
	watch(
		() => [uploadedDocuments.value, uploadedImages.value],
		() => {
			if (uploadedDocuments.value.length || uploadedImages.value.length) {
				messageType.value = "text";
			}
		},
		{
			deep: true,
		}
	);

	/**
	 * Подписка на изменение высоты инпута чтобы скролить вниз чат
	 */
	watch(
		() => dialogActionsHeight.value,
		async () => {
			await nextTick();
			scrollToDialogWrapperBottom();
		},
		{ deep: true }
	);

	/**
	 * Монтирование компонента
	 */
	onMounted(async () => {
		await checkIfDialogBodyHeightsLessThenVH();
		scrollToDialogWrapperBottom();

		window.addEventListener("resize", scrollToDialogWrapperBottom);
		$dialogWrapper.value.addEventListener("scroll", scrollInDialogWrapper);
	});

	const dialogWrapperScrollTop = ref();
	const scrollInDialogWrapper = () => {
		dialogWrapperScrollTop.value = $dialogWrapper.value.scrollTop;
	};

	/**
	 * Проверка высоты блока с сообщениями и скролл к последнему сообщению
	 */
	const $dialogWrapperScroll = ref<HTMLDivElement>();
	const $dialogWrapper = ref<HTMLDivElement>();
	const $dialog = ref<HTMLDivElement>();
	provide("dialog", $dialog);
	const $dialogActions = ref<HTMLDivElement>();

	const isDialogBodyHeightsLessThenVH = ref(true);

	const scrollToDialogWrapperBottom = () => {
		$dialogWrapper.value!.scrollTop = $dialogWrapper.value!.scrollHeight;
	};

	const checkIfDialogBodyHeightsLessThenVH = async () => {
		await nextTick();

		const dialogBodyHeight = $dialogWrapperScroll.value!.offsetHeight;
		const dialogWrapperHeight = $dialogWrapper.value!.offsetHeight;

		isDialogBodyHeightsLessThenVH.value = dialogBodyHeight < dialogWrapperHeight;
	};

	/**
	 * Управление голосовым сообщением
	 */
	const isMakingAVoiceMessage = ref(false);
	const voiceMessage = ref<string[]>([]);
	let doNotSaveVoiceMessage = false;

	const setVoiceMessage = async (isStarted: boolean, cleanMessage: boolean = false) => {
		if (cleanMessage) {
			doNotSaveVoiceMessage = true;
		}

		isMakingAVoiceMessage.value = isStarted;
		await startRecord();
	};

	let chunks = [];
	let mediaRecorder: MediaRecorder | null = null;
	let stream = null;
	let audioBlob = null;
	let startTime;
	const messageDuration = ref(0);
	let messageIntervalId;

	/**
	 * Начала записи голосового сообщения
	 */
	async function startRecord() {
		const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();

		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			return console.warn("Not supported");
		}

		if (!mediaRecorder) {
			try {
				stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				stream.getTracks;

				mediaRecorder = new MediaRecorder(stream);
				mediaRecorder.start();

				startTime = new Date().getTime();

				mediaRecorder.ondataavailable = e => {
					chunks.push(e.data);
				};

				messageIntervalId = setInterval(() => (messageDuration.value = (new Date().getTime() - startTime) / 1000), 1000);

				mediaRecorder.onstop = mediaRecorderStop;
			} catch (e) {
				console.error(e);
			}
		} else {
			mediaRecorder?.stop();
			clearInterval(messageIntervalId);
			messageDuration.value = 0;
		}
	}

	//// stop mic
	function stopAudioOnly(stream) {
		stream?.getTracks()?.forEach(track => {
			if (track.readyState == "live" && track.kind === "audio") {
				track.stop();
			}
		});
	}

	/**
	 * Прекращение записи голосового сообщения
	 */

	function mediaRecorderStop() {
		audioBlob = new Blob(chunks, { type: "audio/mp3" });
		const src = URL.createObjectURL(audioBlob);

		if (doNotSaveVoiceMessage) {
			voiceMessage.value = [];
			doNotSaveVoiceMessage = false;
		} else {
			voiceMessage.value = [src];
			sendVoiceMessage();
		}

		stopAudioOnly(stream);
		mediaRecorder?.stop();
		console.log(mediaRecorder);
		mediaRecorder = null;
		chunks = [];
	}

	// Функция для удаления лишних переносов в конце строки
	const removeTrailingNewlines = (text: globalThis.Ref<string>) => {
		text.value = text.value.replace(/(\n|\r\n)+$/, "");
	};

	/**
	 * Отправить текстовое сообщение
	 */
	const sendTextMessage = async () => {
		removeTrailingNewlines(messageValue);
		chatsStore.sendTextMessage(messageValue.value, userId.value, openedChatId.value);
		messageValue.value = "";

		await nextTick();

		scrollToDialogWrapperBottom();
		$chatInput.value.resetInputHeight();
	};

	/**
	 * Отправить картинку с или без комментария
	 */
	const sendImageMessage = async () => {
		chatsStore.sendImageMessage(uploadedImages.value, messageValue.value, userId.value, openedChatId.value);
		messageValue.value = "";
		uploadedImages.value = [];
		$chatInput.value.cleanLoadedImages();

		await nextTick();

		scrollToDialogWrapperBottom();
		$chatInput.value.resetInputHeight();
	};

	/**
	 * Отправить файлы с картинкой или без
	 */
	const sendDocumentsMessage = async () => {
		chatsStore.sendFileMessage(uploadedDocuments.value, messageValue.value, userId.value, openedChatId.value);
		messageValue.value = "";
		uploadedDocuments.value = [];
		$chatInput.value.cleanLoadedDocuments();

		await nextTick();

		scrollToDialogWrapperBottom();
		$chatInput.value.resetInputHeight();
	};

	/**
	 * Отправить файлы с картинкой или без
	 */
	const sendVoiceMessage = async () => {
		chatsStore.sendVoiceMessage(voiceMessage.value, messageValue.value, userId.value, openedChatId.value);
		messageValue.value = "";
		voiceMessage.value = [];

		await nextTick();

		scrollToDialogWrapperBottom();
	};

	const handleMessage = () => {
		if (messageType.value === "text" && !noMessageToSend.value) {
			/** Если смешанная отправка фото и доков, то текст сообщения дублируется */
			let temporalStorageForTextMessage;

			if (uploadedImages.value.length) {
				uploadedDocuments.value.length && (temporalStorageForTextMessage = messageValue.value);
				sendImageMessage();
			}

			if (uploadedDocuments.value.length) {
				temporalStorageForTextMessage && (messageValue.value = temporalStorageForTextMessage);
				sendDocumentsMessage();
			}

			if (messageValue.value && !uploadedDocuments.value.length && !voiceMessage.value.length) {
				sendTextMessage();
			}
		} else if (messageType.value === "voice") {
			if (isMakingAVoiceMessage.value) {
				setVoiceMessage(false);
			} else {
				setVoiceMessage(true);
			}
		}
	};

	/**
	 * Является ли сообщение последним в своем типе (когда несколько своих подряд)
	 * @param _idx
	 */
	const checkIfLastOfSeveralMessages = (_idx: string | number, arrayWithMessages: Array<MessageType | GroupChatMessageType>): boolean => {
		const messages = arrayWithMessages;
		if (messages[(_idx as number) + 1]) {
			return messages[_idx].userId !== messages[(_idx as number) + 1].userId;
		} else {
			return true;
		}
	};

	/**
	 * Является ли сообщение последним в своем типе (когда несколько своих подряд)
	 * @param _idx
	 */
	const checkIfFirstOfSeveralMessages = (_idx: string | number, arrayWithMessages: Array<MessageType | GroupChatMessageType>): boolean => {
		const messages = arrayWithMessages;
		if (messages[(_idx as number) - 1]) {
			return messages[_idx].userId !== messages[(_idx as number) - 1].userId;
		} else {
			return true;
		}
	};
</script>

<template>
	<div
		class="dialog"
		ref="$dialog"
		:class="{
			dialog_mobile: isMobileSize,
		}"
	>
		<div
			class="dialog__date"
			:class="{
				dialog__date_today: preparedDay === 'Сегодня',
				dialog__date_hide: !shownDate,
			}"
			:style="{
        transform: isMobileSize ? `translateX(calc(-50%))` : `translateX(calc(-50% - 11px))`,
        opacity: $dialogWrapper!?.offsetHeight  < ($dialogWrapperScroll!?.offsetHeight - 42) ? '1' : '0',
      }"
		>
			{{ preparedDay }}
		</div>
		<div
			ref="$dialogWrapper"
			class="dialog__wrapper"
			:class="{
				dialog__wrapper_flex: isDialogBodyHeightsLessThenVH,
				dialog__wrapper_mobile: isMobileSize,
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
						v-model:shown-date="shownDate"
						:is-first-date="index === 0"
						:date="messagesSortedByDay.date"
						:dialog-wrapper-scroll-top="dialogWrapperScrollTop"
						:last-date="index === openedChatData?.messages.length - 1"
					/>

					<DaySeparator />

					<div
						v-for="(message, idx) in messagesSortedByDay?.messages"
						:key="message.id"
						class="dialog__message"
						:style="{
							alignSelf: message.type === 'message-info' ? 'center' : message.userId == userId ? 'flex-end' : 'flex-start',
						}"
					>
						<MessageInfo
							v-if="message.type === 'message-info'"
							:message="message"
							:is-next-message-info-message="checkIfLastOfSeveralMessages(idx, messagesSortedByDay?.messages)"
						/>

						<OwnMessage
							v-if="message.userId === userId && message?.type !== 'message-info'"
							:message="message"
							:last-of-several-msgs="checkIfLastOfSeveralMessages(idx, messagesSortedByDay?.messages)"
						/>

						<OtherMessage
							:isFirst="idx == 0"
							v-if="message.userId !== userId && message?.type !== 'message-info'"
							:message="message"
							:last-of-several-msgs="checkIfLastOfSeveralMessages(idx, messagesSortedByDay?.messages)"
							:first-of-several-msgs="checkIfFirstOfSeveralMessages(idx, messagesSortedByDay?.messages)"
							:is-show-name="openedChatData.isGroupChat"
						/>
					</div>
				</div>
			</div>
		</div>

		<div
			ref="$dialogActions"
			class="dialog__actions"
			:class="{
				dialog__actions_mobile: isMobileSize,
			}"
			:style="{
				flex: dialogActionsHeight,
			}"
		>
			<ChatInput
				ref="$chatInput"
				v-model:input-value="messageValue"
				v-model:loaded-images="uploadedImages"
				v-model:loaded-documents="uploadedDocuments"
				v-model:is-resizing="isResizing"
				v-model:dialog-actions-height="dialogActionsHeight"
				class="dialog__input"
				placeholder="Напишите сообщение…"
				:add-documents="true"
				:is-making-a-voice-message="isMakingAVoiceMessage"
				:message-duration="messageDuration"
				:is-height-resizable="true"
				@send-message="handleMessage"
			/>

			<button
				class="dialog__send-msg"
				:class="{
					'dialog__send-msg_active': isMakingAVoiceMessage,
				}"
				@click="handleMessage"
			>
				<MicrophoneIcon v-if="!isMakingAVoiceMessage && noMessageToSend" />

				<SendMsgIcon v-else />
			</button>
		</div>

		<div
			v-if="isMakingAVoiceMessage"
			class="dialog__voice-bg"
			@click="setVoiceMessage(false, true)"
			@keydown.enter.prevent.exact="$emit('sendVoiceMessage')"
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
	@import "DialogBody";
</style>
