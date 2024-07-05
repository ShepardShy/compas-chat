<script setup lang="ts">
	import AddDocuments from "assets/icons/add-doc-icon.svg";
	import { docTypes, imagesTypes, inputFilesTypes } from "~/shared/const";
	import { LoadedDocuments, LoadedImages } from "~/components";
	import { useSettingsStore } from "~/store/settings";
	import { useChatsStore } from "~/store/chats";
	import { setInterval } from "#imports";

	/**
	 * Входящие пропсы
	 */
	interface PropsType {
		placeholder?: string;
		addDocuments?: boolean;
		inputValue: string | undefined;
		width?: string;
		isMakingAVoiceMessage?: boolean;
		messageDuration?: number;
		isHeightResizable?: boolean;
		loadedImages?: Array<unknown>;
		loadedDocuments?: Array<unknown>;
		isResizing?: boolean;
		dialogActionsHeight: string;
	}

	const props = defineProps<PropsType>();
	const { placeholder, addDocuments, inputValue, width, isMakingAVoiceMessage, messageDuration, isHeightResizable, loadedImages, loadedDocuments } = toRefs(props);

	/**
	 * События
	 */
	const emit = defineEmits<{
		(emit: "update:inputValue", _inputValue: string): void;
		(emit: "update:loadedImages", loadedImages: Array<unknown>): void;
		(emit: "update:loadedDocuments", loadedDocuments: Array<unknown>): void;
		(emit: "update:isResizing", isResizing: boolean): void;
		(emit: "update:dialogActionsHeight", value: string): void;
		(emit: "sendMessage"): void;
	}>();

	/** Подключение стора с настройками */
	const settingsStore = useSettingsStore();
	const { isMobileSize } = storeToRefs(settingsStore);

	/** Подключение стора с данными чата */
	const chatsStore = useChatsStore();
	const { openedChatId } = storeToRefs(chatsStore);

	/** Открыто ли приложение в сафари */
	const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	/**
	 * Открыто ли меню для подгрузки файлов
	 */
	const isFilesTypesMenuOpen = ref<boolean>(false);
	/**
	 * Выбранный тип файлов для загрузки
	 */
	const activeFileType = ref();
	/**
	 * Загружеггые изображения
	 */
	const uploadedImages = ref([]);
	/**
	 * Загруженные документы
	 */
	const uploadedDocuments = ref([]);
	/** Ссылка на блок с отображаемыми выбранными файлами */
	const $files = ref<HTMLInputElement>();

	/**
	 * Задает тип документов инпута при загрузке
	 */
	const documentsType = computed(() => {
		if (activeFileType.value == "Фото") {
			return imagesTypes.join(",");
		}
		if (activeFileType.value == "Файл") {
			return docTypes.join(",");
		}
	});
	/**
	 * Определение placeholder для инпута
	 */
	const placeholderValue = computed(() => {
		if (isMakingAVoiceMessage.value) {
			return "Для отмены кликните курсором вне поля";
		} else {
			return placeholder.value;
		}
	});
	/**
	 * Преобразование длины голосового сообщения
	 */
	const voiceMessageLengthTransformer = computed(() => {
		if (!messageDuration.value) {
			return "00:00:00";
		}

		const oneMinuteInSeconds = 60;
		const oneHourInSeconds = 60 * 60;

		const messageDurationSeconds = messageDuration.value.toFixed(0) as unknown as number;
		console.log(messageDuration.value);
		

		const hours = Math.floor(messageDurationSeconds / oneHourInSeconds);
		const minutes = Math.floor((messageDurationSeconds - hours * oneHourInSeconds) / oneMinuteInSeconds);
		const seconds = Math.floor(messageDurationSeconds % oneMinuteInSeconds);

		let finalDuration = "";

		function addTime(time: number, isLast: boolean = false) {
			if (time < 10) {
				finalDuration += "0" + time;
			} else {
				finalDuration += time;
			}

			!isLast && (finalDuration += ":");
		}

		// addTime(hours);
		addTime(minutes);
		addTime(seconds);
		finalDuration += +messageDuration.value.toFixed(1)

		return finalDuration;
	});

	/**
	 * Подписка на загрузку изображений и документов
	 */

	const inputPaddings = 50;
	const marginBottomFiles = 20;
	let intervalToUpdateInputHeight;
	watch(
		() => [uploadedImages.value, uploadedDocuments.value, inputValue.value],
		() => {
			if (!uploadedImages.value?.length && !uploadedDocuments.value?.length && !inputValue.value) {
				resetInputHeight();
				return;
			}

			console.log(uploadedImages.value, "uploadedImages");
			console.log(uploadedDocuments.value, "uploadedDocuments");

			uploadedImages.value?.length && emit("update:loadedImages", uploadedImages.value);
			uploadedDocuments.value?.length && emit("update:loadedDocuments", uploadedDocuments.value);

			if (uploadedImages.value?.length || uploadedDocuments.value?.length) {
				intervalToUpdateInputHeight = setInterval(() => {
					if ($files.value?.offsetHeight) {
						clearInterval(intervalToUpdateInputHeight);
						emit("update:dialogActionsHeight", `0 0 ${$files.value.offsetHeight + currentInputHeight}px`);
					}

					if ($inputBody.value?.offsetHeight > minHeight) {
						clearInterval(intervalToUpdateInputHeight);
						emit("update:dialogActionsHeight", `0 0 ${currentInputHeight}px`);
					}
				}, 100);
			} else {
				clearInterval(intervalToUpdateInputHeight);
			}
		},
		{
			deep: true,
		}
	);

	/** Подписка на смену чата */
	// watch(
	// 	() => openedChatId.value,
	// 	() => {
	// 		currentInputHeight = 40;
	// 		emit("update:dialogActionsHeight", `0 0 ${currentInputHeight + inputPaddings + marginBottomFiles}px`);
	// 	}
	// );

	/**
	 * Монтирование компонента
	 */
	onMounted(() => {
		uploadedImages.value = loadedImages.value;
		uploadedDocuments.value = loadedDocuments.value;

		window.addEventListener("click", event => {
			if (isFilesTypesMenuOpen.value && !(event.target as HTMLUnknownElement).closest(".doc__menu") && !(event.target as HTMLUnknownElement).closest(".input__add-doc-icon")) {
				isFilesTypesMenuOpen.value = false;
			}
		});
	});

	/**
	 * Загрузка файлов
	 */
	const $uploadDocuments = ref<HTMLInputElement>();
	const filesData = ref();

	// Открыть/закрыть меню выбора типа загружаемых файлов
	const toggleFilesMenuType = () => {
		isFilesTypesMenuOpen.value = !isFilesTypesMenuOpen.value;
	};

	// Задать активнй тип файла и открыть меню для выбора файлов
	const setActiveFileType = async (fileType: typeof inputFilesTypes) => {
		console.log(fileType);

		activeFileType.value = fileType;
		toggleFilesMenuType();
		await nextTick();
		$uploadDocuments.value.click();
	};

	// Загрузка файлов
	const onChangeChooseFiles = (_event: any) => {
		const _files = _event.target.files;

		for (let i = 0; i < _files.length; i++) {
			const _file = _files[i];
			const _imageUrl = URL.createObjectURL(_file);
			const _fileName = _files[i].name;
			const _fileSizeKB = `${(_files[i].size / 1024).toFixed(2)}KB`;

			if (_file.type.includes("image")) {
				uploadedImages.value = [
					...uploadedImages.value,
					{
						id: i,
						url: _imageUrl,
						name: _fileName,
						size: _fileSizeKB,
					},
				];
			} else {
				uploadedDocuments.value = [
					...uploadedDocuments.value,
					{
						id: i,
						url: _imageUrl,
						name: _fileName,
						size: _fileSizeKB,
					},
				];
			}
		}
		setTimeout(() => {
			scrollToDialogBottom();
		}, 10);
	};

	/**
	 * Управление высотой инпута
	 */
	const $inputBody = ref();
	const $input = ref();
	const $inputResizeIcon = ref<HTMLDivElement>();
	let startPosition;
	let currentInputHeight: number;
	const maxInputHeight = 300;
	const countOfLines = computed(() => {
		const lines = inputValue.value ? inputValue.value.split("\n").length - 1 : 0;
		return 16 * lines;
	});

	// Дефолтное значение
	const local = localStorage.getItem("defaultInputHeight");
	let defaultInputHeight = local ? local : 40;
	let minHeight = 40;
	if (isHeightResizable.value) {
		currentInputHeight = +defaultInputHeight;
		autoResizeTextarea();
	} else {
		defaultInputHeight = 40;
	}
	watch(
		() => countOfLines.value,
		() => {
			minHeight = 40 + countOfLines.value;
			if (countOfLines.value == 0) {
				currentInputHeight = minHeight;

				autoResizeTextarea();
			}
		}
	);
	watch(
		() => inputValue.value,
		() => {
			autoResizeTextarea();
		}
	);

	let isHeightResizing = false;
	let inputHeightWhenStartResizing;

	// Старт изменения высоты инпута
	const startInputHeightResizing = (_event: MouseEvent) => {
		_event.preventDefault();
		isHeightResizing = true;

		inputHeightWhenStartResizing = currentInputHeight;

		$inputResizeIcon.value.style.cursor = "grabbing";
		$inputBody.value.style.height = `${currentInputHeight}px`;
		startPosition = $inputBody.value.getBoundingClientRect().top;

		window.addEventListener("mousemove", keepInputHeightResizing);
		window.addEventListener("mouseup", stopInputHeightResizing);
	};

	const dialog: globalThis.Ref<HTMLDivElement> = inject("dialog");
	const scrollToDialogBottom = () => {
		dialog?.value ? (dialog.value!.scrollTop = dialog.value!.scrollHeight) : 0;
	};

	// Изменение высоты инпута
	const keepInputHeightResizing = (event: MouseEvent) => {
		if (!isHeightResizing) return;
		emit("update:isResizing", $inputBody.value.style.height !== minHeight);

		const currentMousePosition = event.pageY;
		const windowHeight = window.innerHeight;

		scrollToDialogBottom();

		let newHeight;
		newHeight = inputHeightWhenStartResizing + startPosition - currentMousePosition;
		currentInputHeight = Math.min(Math.max(minHeight, newHeight), maxInputHeight);
		localStorage.setItem("defaultInputHeight", String(currentInputHeight));
		defaultInputHeight = currentInputHeight;
		$inputBody.value.style.height = `${currentInputHeight}px`;

		emit("update:dialogActionsHeight", `0 0 ${currentInputHeight}px`);
	};

	// Завершение изменение высоты инпута
	const stopInputHeightResizing = () => {
		if (!isHeightResizing) return;

		$inputResizeIcon.value.style.cursor = "grab";

		window.removeEventListener("mousemove", keepInputHeightResizing);
		window.removeEventListener("mouseup", stopInputHeightResizing);
	};

	/**
	 * Задает border-radius для первого и последнего элемента меню выбора типо загружаемых документов
	 * @param _itemIdx
	 */
	const setBorderRadiusForFirstAndLastItem = _itemIdx => {
		if (_itemIdx == 0) {
			return "5px 5px 0 0";
		} else if (inputFilesTypes.length - 1 == _itemIdx) {
			return "0 0 5px 5px";
		} else {
			return "0 0 0 0";
		}
	};

	/**
	 * Подгонять высоту инпута при вводе на мобилке
	 */
	function autoResizeTextarea() {
		currentInputHeight = Math.min(Math.max(minHeight, +defaultInputHeight), maxInputHeight);
		emit("update:dialogActionsHeight", `0 0 ${currentInputHeight}px`);
		$inputBody.value?.scrollTop ? ($inputBody.value.scrollTop = $inputBody.value.scrollHeight) : 0;
	}

	// Перенос строки у инпута
	const newLine = e => {
		let caret = e.target.selectionStart;
		e.target.setRangeText("\n", caret, caret, "end");
		onTextareaInput(e);
	};

	/**
	 * При вводе данных в инпут
	 */
	const onTextareaInput = (_event: Event) => {
		emit("update:inputValue", (<HTMLTextAreaElement>_event.target).value);

		// if (isHeightResizable?.value) {
		// 	autoResizeTextarea();
		// }
	};

	/**
	 * Очистить загруженные изображения
	 */
	const cleanLoadedImages = () => {
		($uploadDocuments.value.value as unknown) = [];
		uploadedImages.value = [];
	};
	/**
	 * Очистить загруженные документы
	 */
	const cleanLoadedDocuments = () => {
		($uploadDocuments.value.value as unknown) = [];
		uploadedDocuments.value = [];
	};
	/**
	 * Скинуть высоту
	 */
	const resetInputHeight = () => {
		if ($inputBody.value) {
			// emit("update:dialogActionsHeight", "0 0 90px");

			// $inputBody.value.style.height = `${minHeight}px`;
			// $input.value.style.height = `${minHeight}px`;
			// currentInputHeight = minHeight;

			currentInputHeight = Math.min(Math.max(minHeight, +defaultInputHeight), maxInputHeight);
			$inputBody.value.style.height = `${currentInputHeight}px`;
			emit("update:dialogActionsHeight", `0 0 ${currentInputHeight}px`);
		}
	};

	// Скролл в начало при закрытии клавиатуры

	const scrollToTop = () => {
		setTimeout(() => window.scrollTo(0, 0), 10);
	};

	defineExpose({
		cleanLoadedImages,
		cleanLoadedDocuments,
		resetInputHeight,
	});
</script>

<template>
	<div
		v-if="uploadedImages?.length || uploadedDocuments?.length"
		ref="$files"
		class="files"
	>
		<LoadedDocuments
			v-if="uploadedDocuments.length"
			v-model:uploaded-documents="uploadedDocuments"
		/>
		<LoadedImages
			v-if="uploadedImages?.length"
			v-model:uploaded-images="uploadedImages"
		/>
	</div>
	<div
		class="custom-input"
		:style="{
			width: width,
		}"
		v-bind="$attrs"
	>
		<div
			ref="$input"
			class="input"
			:style="{
				width: width,
				height: currentInputHeight + 'px',
			}"
		>
			<textarea
				v-if="isHeightResizable"
				ref="$inputBody"
				:value="inputValue"
				class="input__body"
				:class="{
					input__body_document: addDocuments && !isMakingAVoiceMessage,
					input__body_voice: isMakingAVoiceMessage,
				}"
				:placeholder="placeholderValue"
				:style="{
					width: width,
					height: currentInputHeight + 'px',
					paddingTop: isSafari ? '11px' : '11px',
				}"
				@input="onTextareaInput($event)"
				@blur="scrollToTop"
				@focus="scrollToTop"
				@keydown.enter.prevent.exact="uploadedImages.length > 0 || uploadedDocuments.length > 0 || inputValue.trim().length > 0 ? emit('sendMessage') : 0"
				@keyup.shift.enter.prevent="newLine"
				@keyup.ctrl.enter.prevent="newLine"
			/>

			<input
				v-if="!isHeightResizable"
				ref="$inputBody"
				:value="inputValue"
				class="input__body"
				:class="{
					input__body_document: addDocuments && !isMakingAVoiceMessage,
					input__body_voice: isMakingAVoiceMessage,
				}"
				:placeholder="placeholderValue"
				:style="{
					width: width,
					height: currentInputHeight + 'px',
					paddingTop: isSafari ? '11px' : '11px',
				}"
				@input="onTextareaInput($event)"
			/>

			<div
				v-if="isHeightResizable && !isMobileSize"
				ref="$inputResizeIcon"
				class="input__resize-window"
				@mousedown.prevent="startInputHeightResizing($event)"
			>
				<div class="input__resize-window-line" />
				<div class="input__resize-window-line" />
			</div>

			<AddDocuments
				v-if="addDocuments && !isMakingAVoiceMessage"
				class="input__add-doc-icon"
				:class="{
					'input__add-doc-icon_active': isFilesTypesMenuOpen || filesData,
				}"
				@click="toggleFilesMenuType"
			/>

			<div
				v-if="isMakingAVoiceMessage"
				class="input__voice-msg-circle"
			/>

			<div
				v-if="isMakingAVoiceMessage"
				class="input__voice-msg-length"
			>
				{{ voiceMessageLengthTransformer }}
			</div>

			<input
				ref="$uploadDocuments"
				class="input__documents"
				type="file"
				multiple
				:accept="documentsType"
				@change="onChangeChooseFiles($event)"
			/>

			<div
				v-if="isFilesTypesMenuOpen"
				class="doc__menu"
			>
				<div
					v-for="(fileType, idx) in inputFilesTypes"
					class="doc__item"
					:style="{
						borderRadius: setBorderRadiusForFirstAndLastItem(idx),
					}"
					@click="setActiveFileType(fileType)"
				>
					{{ fileType }}
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "./ChatInput";
</style>
