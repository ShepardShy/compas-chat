<script setup lang="ts">
	import { nextTick } from "vue";
	import { ChatInput, OwnMessage, OtherMessage, VoiceMessageType, MessageDay, MessageInfo, DaySeparator, MessagePhoto } from "~/components";

	import SendMsgIcon from "assets/icons/send-msg-icon.svg";
	import MicrophoneIcon from "assets/icons/microphone-icon.svg";

	import { useChatsStore } from "~/store/chats";
	import { useSettingsStore } from "~/store/settings";

	import type { GroupChatMessageType, MessageType } from "~/types/messages";
	import { setMessageDay, clearSelection } from "~/composables/chats";
	import { useDatePickStore } from "~/store/datePick";
	import { useModalStore } from "~/store/modal";

	const modalStore = useModalStore();
	const { showModal } = modalStore;

	defineEmits(["sendVoiceMessage"]);

	/**
	 * Подключение стора с чатами
	 */
	const chatsStore = useChatsStore();
	const { openedChatData, openedChatDataMessages, userId, openedChatId, getChatIndex, chats } = storeToRefs(chatsStore);
	/**
	 * Подключение стора с настройками
	 */
	const settingsStore = useSettingsStore();
	const { isMobileSize, heightWithKeyboard } = storeToRefs(settingsStore);

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
		$dialogWrapper.value ? ($dialogWrapper.value!.scrollTop = $dialogWrapper.value!?.scrollHeight) : "";
	};

	const checkIfDialogBodyHeightsLessThenVH = async () => {
		await nextTick();

		const dialogBodyHeight = $dialogWrapperScroll.value!?.offsetHeight;
		const dialogWrapperHeight = $dialogWrapper.value!?.offsetHeight;

		isDialogBodyHeightsLessThenVH.value = dialogBodyHeight < dialogWrapperHeight;
	};

	const dialogWrapperScrollTop = ref();
	const scrollInDialogWrapper = () => {
		dialogWrapperScrollTop.value = $dialogWrapper.value.scrollTop;
	};

	// Пролистан ли чат до конца
	const isDialogAtBottom = computed(() => dialogWrapperScrollTop.value + $dialogWrapper.value?.offsetHeight + 10 >= $dialogWrapper.value?.scrollHeight);

	/** Нет данных для сообщений */
	const noMessageToSend = computed(() => !uploadedImages.value.length && !uploadedDocuments.value.length && !voiceMessage.value.length && !messageValue.value?.trim());

	/**
	 * Подписка на измнение чата и его очистку
	 */
	watch(
		() => openedChatId.value,
		async (_, oldVal) => {
			messageType.value = "text";
			voiceMessage.value = [];
			$chatInput.value.cleanLoadedImages();
			$chatInput.value.cleanLoadedDocuments();

			await checkIfDialogBodyHeightsLessThenVH();
			scrollToDialogWrapperBottom();
			if (chats.value?.[getChatIndex.value(oldVal)]) {
				chats.value[getChatIndex.value(oldVal)].isScrolled = false;
			}

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

	// Сообщения от собеседника
	const notMyMessages = computed(() => openedChatDataMessages.value.messages?.filter(message => message?.userId != userId.value)?.length);
	let notMyMessagesCurrent = notMyMessages.value;

	// Подписка на приход сообщений
	watch(
		() => openedChatData.value,
		async () => {
			// Если чат пролистан до конца, тогда пролистать до нового сообщения
			if (isDialogAtBottom.value && notMyMessages.value > notMyMessagesCurrent) {
				await nextTick();
				scrollToDialogWrapperBottom();
				scrollInDialogWrapper();
			}
			notMyMessagesCurrent = notMyMessages.value;
		}
	);

	// Если чат пролистан до конца, тогда навесить на чат флаг
	watch(
		() => [isDialogAtBottom.value, openedChatId.value],
		newVal => {
			if (chats.value?.[getChatIndex.value(openedChatId.value)]) {
				chats.value[getChatIndex.value(openedChatId.value)].isScrolled = newVal ? true : false;
			}
		},
		{ immediate: true }
	);

	/** Подписка на загрузку сообщений */
	watch(
		() => [uploadedDocuments.value, uploadedImages.value],
		() => {
			console.log(uploadedDocuments.value, "uploadedDocuments.value");
			console.log(uploadedImages.value, "uploadedImages.value");

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

	const dialogWidth = ref(`${0}px`);
	const setDialogWidth = () => {
		dialogWidth.value = $dialog.value?.offsetWidth - 5 + "px";
	};
	/**
	 * Монтирование компонента
	 */
	onMounted(async () => {
		await checkIfDialogBodyHeightsLessThenVH();
		scrollToDialogWrapperBottom();
		setDialogWidth();

		window.addEventListener("resize", scrollToDialogWrapperBottom);
		window.addEventListener("resize", setDialogWidth);
		$dialogWrapper.value.addEventListener("scroll", scrollInDialogWrapper);
	});

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
	let fullDuration = null;

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

				messageIntervalId = setInterval(() => (messageDuration.value = (new Date().getTime() - startTime) / 1000), 100);

				mediaRecorder.onstop = mediaRecorderStop;
			} catch (e) {
				console.error(e);
			}
		} else {
			mediaRecorder?.stop();
			clearInterval(messageIntervalId);
			fullDuration = messageDuration.value;
			messageDuration.value = 0;
		}
	}

	// stop mic
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
		if (fullDuration < 0.8) {
			doNotSaveVoiceMessage = true;
		}

		if (doNotSaveVoiceMessage) {
			voiceMessage.value = [];
			doNotSaveVoiceMessage = false;
		} else {
			voiceMessage.value = [src];
			sendVoiceMessage();
			playSendMessageAudio();
		}

		stopAudioOnly(stream);
		mediaRecorder?.stop();
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

	// Звук отправки сообщения

	const playSendMessageAudio = () => {
		const audio = new Audio();
		audio.src = "/audio/send-msg.wav";
		audio.play();
	};

	// Обработчик отправки сообщения
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

			playSendMessageAudio();
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
		if (messages?.[(_idx as number) + 1]) {
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
		if (messages?.[(_idx as number) - 1]) {
			return messages[_idx].userId !== messages[(_idx as number) - 1].userId;
		} else {
			return true;
		}
	};

	// Скролл до элемента
	const isScrolling = ref(false);
	const scrollToMessage = async message => {
		const messageOffsetTop = message.offsetTop;
		// const scrollPosition = messageOffsetTop - 0.5;
		const scrollPosition = messageOffsetTop > 5 ? messageOffsetTop : 0;
		await nextTick();
		!isScrolling.value && $dialogWrapper.value.scrollTo({ top: scrollPosition, behavior: "smooth" });
		isScrolling.value = true;

		setTimeout(() => {
			isScrolling.value = false;
		}, 500);
	};

	// Клик по плавающей дате

	const $dialogDate = ref(null);
	const clickDateHandler = async () => {
		const message = messagesWithIsoDates.value.find(p => p.date == preparedDay.value.split(".").reverse().join("-"));

		const messageToScroll = $dialogBody.value?.[message.index] as HTMLDivElement;
		scrollToMessage(messageToScroll);
	};
	watch(
		() => dialogWrapperScrollTop.value,
		async () => {
			if (dialogWrapperScrollTop.value == 0) {
				await nextTick();
				shownDate.value = "";
			}
		}
	);

	// Дата из модалки выбора даты

	const datePickStore = useDatePickStore();
	const { selectedDate } = storeToRefs(datePickStore);
	const $dialogBody = ref(null);

	// Ближайшая дата к массиву дат

	const findClosest = (list, date = new Date().toLocaleDateString("en-GB")) => {
		const parseDate = date => Date.parse(date);
		const findDate = parseDate(date);

		return list.reduce(
			(acc, cur) => {
				const delta = Math.abs(parseDate(cur.date) - (findDate + 1));
				return delta >= 0 && delta < acc.delta ? { delta, el: cur } : acc;
			},
			{ delta: Number.MAX_SAFE_INTEGER, el: null }
		).el;
	};

	// Сообщения с отформатированной датой

	const messagesWithIsoDates = computed(() =>
		openedChatData.value.messages.map((message, index) => {
			return { ...message, date: message.date.split(".").reverse().join("-"), index };
		})
	);

	// Скролл при выборе даты

	watch(
		() => selectedDate.value,
		() => {
			if (selectedDate.value) {
				const closestMessageToDate = findClosest(messagesWithIsoDates.value, selectedDate.value);

				const messageToScroll = $dialogBody.value?.[closestMessageToDate.index] as HTMLDivElement;

				if (messageToScroll) {
					scrollToMessage(messageToScroll);

					// Добавляем класс активного сообщения
					messageToScroll.classList.add("active-message");
					setTimeout(() => {
						messageToScroll.classList.remove("active-message");
					}, 1000);

					// Сброс значения даты после прокрутки
					selectedDate.value = null;
				}
			}
		},
		{ deep: true }
	);

	// Клавиатура safari
	let fullHeight;
	onMounted(() => {
		heightWithKeyboard.value = "100svh";
		setTimeout(() => {
			fullHeight = window.visualViewport.height;
		}, 100);
	});
	const preventScrollWhenSoftKeyboardFocus = async e => {
		await nextTick();
		setTimeout(() => {
			const currentHeight = window.visualViewport.height;
			if (fullHeight > currentHeight) {
				heightWithKeyboard.value = `${fullHeight - (fullHeight - currentHeight)}px`;
			}
			window.scrollTo({ top: 0, behavior: "instant" });
		}, 200);
	};
	const preventScrollWhenSoftKeyboardBlur = e => {
		heightWithKeyboard.value = "100svh";
	};
</script>

<template>
	<div
		class="dialog"
		ref="$dialog"
		:style="`--dialogWidth: ${dialogWidth};height: calc(${heightWithKeyboard} - 81px);`"
		:class="{
			dialog_mobile: isMobileSize,
		}"
	>
		<div
			ref="$dialogWrapper"
			class="dialog__wrapper"
			@scroll.passive
			:class="{
				dialog__wrapper_flex: isDialogBodyHeightsLessThenVH,
				dialog__wrapper_mobile: isMobileSize,
			}"
		>
			<div
				ref="$dialogWrapperScroll"
				class="dialog__wrapper-scroll"
			>
				<div class="dialog__date-wrapper">
					<div
						v-if="dialogWrapperScrollTop > 0"
						@pointerup.left.stop="clickDateHandler"
						class="dialog__date"
						ref="$dialogDate"
						:class="{
							dialog__date_today: preparedDay === 'Сегодня',
							dialog__date_hide: !shownDate,
						}"
						:style="{
       						transform: isMobileSize ? `translateX(calc(-50%))` : `translateX(calc(-50% + 15px))`,
        					opacity: $dialogWrapper!?.offsetHeight < ($dialogWrapperScroll!?.offsetHeight - 42) ? '1' : '0',
      					}"
					>
						{{ preparedDay }}
					</div>
				</div>
				<div
					v-for="(messagesSortedByDay, index) in openedChatData?.messages"
					:key="index"
					class="dialog__body"
					ref="$dialogBody"
					:id="`$dialogBody`"
				>
					<MessageDay
						v-model:shown-date="shownDate"
						:is-first-date="index === 0"
						:date="messagesSortedByDay.date"
						:dialog-wrapper-scroll-top="dialogWrapperScrollTop"
						:dialogWidth="dialogWidth"
						:last-date="index === openedChatData?.messages.length - 1"
					/>

					<DaySeparator />

					<div
						class="dialog__messages-wrapper"
						v-for="(userMessages, userIndex) in messagesSortedByDay.messages"
						:key="userIndex"
					>
						<div class="dialog__photo-wrapper">
							<MessagePhoto
								@click="showModal"
								:firstName="'users' in openedChatData ? openedChatData.users.find(user => 'userId' in user && user.userId == userMessages.userId)?.firstName : 'firstName' in openedChatData ? openedChatData.firstName : ''"
								:photo="'users' in openedChatData ? openedChatData.users.find(user => 'userId' in user && user.userId == userMessages.userId)?.photo : 'photo' in openedChatData ? openedChatData.photo : ''"
								v-if="checkIfLastOfSeveralMessages(userIndex, userMessages.messages[0].messages) && userMessages.userId != userId && userMessages.messages[0].type !== 'message-info'"
							/>
						</div>

						<div class="dialog__messages">
							<div
								v-for="(message, idx) in userMessages.messages"
								:key="message.id"
								class="dialog__message"
								:class="{ 'message-start': message.userId != userId, 'message-end': message.userId == userId }"
								:style="{
									justifyContent: message.type === 'message-info' ? 'center' : message.userId == userId ? 'flex-end' : 'flex-start',
								}"
							>
								<MessageInfo
									v-if="message.type === 'message-info'"
									:message="message"
									:is-next-message-info-message="checkIfLastOfSeveralMessages(idx, userMessages.messages)"
								/>

								<OwnMessage
									v-if="message.userId === userId && message?.type !== 'message-info'"
									:message="message"
									:last-of-several-msgs="checkIfLastOfSeveralMessages(idx, userMessages.messages)"
								/>

								<OtherMessage
									:isFirst="idx == 0"
									v-if="message.userId !== userId && message?.type !== 'message-info'"
									:message="message"
									:last-of-several-msgs="checkIfLastOfSeveralMessages(idx, userMessages.messages)"
									:first-of-several-msgs="checkIfFirstOfSeveralMessages(idx, userMessages.messages)"
									:is-show-name="openedChatData.isGroupChat"
									:dialog-wrapper-scroll-top="dialogWrapperScrollTop"
									:dialogWidth="dialogWidth"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div
			@dblclick="clearSelection"
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
				@focus="preventScrollWhenSoftKeyboardFocus"
				@blur="preventScrollWhenSoftKeyboardBlur"
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
				@pointerup.left.stop="handleMessage"
			>
				<MicrophoneIcon v-if="!isMakingAVoiceMessage && noMessageToSend" />

				<SendMsgIcon v-else />
			</button>
		</div>

		<div
			v-if="isMakingAVoiceMessage"
			class="dialog__voice-bg"
			@pointerup.left.stop="setVoiceMessage(false, true)"
			@keydown.enter.prevent.exact="$emit('sendVoiceMessage')"
		/>
	</div>
</template>

<style scoped lang="scss">
	@import "DialogBody";
</style>
