<script setup lang="ts">
	import type { GroupChatMessageType, ImageMessageType, MessageType } from "~/types/messages";
	import ViewedMessageIcon from "assets/icons/viewed-message-icon.svg";
	import ReceivedMessageIcon from "assets/icons/recieved-message-icon.svg";
	import FansyBox from "~/components/ui/AppFansyBox/FansyBox.vue";
	import FansyBoxImage from "~/components/ui/AppFansyBox/FansyBoxImage/FansyBoxImage.vue";
	import AppFile from "~/components/ui/AppInputs/File/File.vue";
	import { useSettingsStore } from "~/store/settings";
	import moment from "moment";

	/**
	 * Входящие пропсы
	 */
	interface PropsType {
		message: GroupChatMessageType | MessageType;
		otherMessage: boolean;
	}

	const props = defineProps<PropsType>();
	const { message, otherMessage } = toRefs(props);

	/**
	 * Подключение стора с настройками
	 */
	const settingsStore = useSettingsStore();
	const { isMobileSize } = toRefs(settingsStore);

	/**
	 * Количество колонок для отображения картинок
	 */
	const gridColumn = computed(() => {
		if (isMobileSize.value) {
			if (message.value?.images?.length <= 2) {
				return `repeat( ${message.value?.images?.length}, 1fr)`;
			} else if (message.value?.images?.length === 3) {
				return "calc(66.66% - 5px) 33.33%";
			}

			return "repeat(2,calc(50% - 2.5px))";
		}

		if (message.value?.images?.length < 3) {
			return `repeat( ${message.value?.images?.length}, 1fr)`;
		}

		return "calc(66.66% - 5px) 33.33%";
	});

	/** Задает borderRadius для оболочки отражения картинок */
	const borderRadius = computed(() => (message.value.comment ? "10px 10px 0 0" : otherMessage.value ? "10px 10px 10px 6px" : "10px 10px 6px 10px"));

	/**
	 * Высота картинки
	 */
	const gridRows = computed(() => {
		const imagesLength = message.value?.images?.length <= 4 ? message.value?.images?.length : 4;

		if (isMobileSize.value) {
			if (imagesLength <= 2) {
				return "285px";
			} else {
				return "repeat(2, calc(285px / 2))";
			}
		}

		if (message.value?.images?.length <= 2) {
			return "323px";
		}

		return imagesLength === 3 ? "repeat(2, calc(323px / 2))" : "repeat(3, calc(323px / 3))";
	});

	const imageOne = computed(() => {
		const shownImagesLength = message.value.images?.slice(0, 4).length;
		if (shownImagesLength === 1) {
			return "1";
		} else if (shownImagesLength <= 3) {
			return "1 / span 2";
		} else if (isMobileSize.value && shownImagesLength === 4) {
			return "span 1";
		} else if (!isMobileSize.value && shownImagesLength === 4) {
			return "1 / span 3";
		}
	});

	const imageTwo = computed(() => {
		const shownImagesLength = message.value.images?.slice(0, 4).length;
		return isMobileSize.value && shownImagesLength === 4 ? "span 1" : "1 / 2";
	});

	const imageThree = computed(() => {
		const shownImagesLength = message.value.images?.slice(0, 4).length;
		return isMobileSize.value && shownImagesLength === 4 ? "span 1" : "2 / 3";
	});

	const imageFour = computed(() => {
		const shownImagesLength = message.value.images?.slice(0, 4).length;
		return isMobileSize.value && shownImagesLength === 4 ? "span 1" : "3 / 4";
	});

	/**
	 * Есть ли скрытые картинки
	 */
	const isImagesMoreThenShown = computed(() => message.value.images?.length > 4);
	/**
	 * Сообщение доставлено
	 */
	const isMessageReceived = computed<boolean>(() => {
		return message.value.isReceived && !message.value.isViewed;
	});
	/**
	 * Сообщение просмотрено
	 */
	const isMessageViewed = computed<boolean>(() => {
		return message.value.isViewed;
	});
	/**
	 * Картинки для отображения
	 */
	const maxImagesToShow = computed(() => message.value.images?.slice(0, 4));
	/**
	 * Скрытые картинки
	 */
	const hideImagesLength = computed(() => message.value.images?.length - maxImagesToShow.value?.length);

	/**
	 * Вывод времени сообщения
	 */
	const messageTime = (): string => {
		return moment(message.value.date)?.format("H:mm");
	};

	/**
	 * Просмотрено ли изображение
	 */
	const isImageViewed = (_image: ImageMessageType) => {
		return _image.isViewed;
	};

	/**
	 * Получено ли изображение
	 */
	const isImageReceived = (_image: ImageMessageType) => {
		return _image.isReceived && !_image.isViewed;
	};
</script>

<template>
	<FansyBox
		class="image-message"
		:class="{
			'image-message_mobile': isMobileSize,
		}"
	>
		<div
			class="image-message__images"
			:style="{
				gridTemplateColumns: gridColumn,
				gridTemplateRows: gridRows,
				height: isMobileSize ? '285px' : '333px',
				borderRadius,
			}"
		>
			<div
				v-for="(image, idx) in message.images"
				:key="image"
				class="image-message__image"
				:class="{
					'image-message__hide-images_last': isImagesMoreThenShown && idx === 3,
				}"
				:style="{
					gridRow: (idx === 0 && imageOne) || (idx === 1 && imageTwo) || (idx === 2 && imageThree) || (idx === 3 && imageFour),
					display: !((idx === 0 && imageOne) || (idx === 1 && imageTwo) || (idx === 2 && imageThree) || (idx === 3 && imageFour)) ? 'none' : 'block',
				}"
			>
				<div
					v-if="isImagesMoreThenShown && idx === 3"
					class="image-message__hide-images-length"
				>
					<img
						data-fancybox="gallery"
						:src="image.url"
					/>
					<span>{{ `+${hideImagesLength}` }}</span>
				</div>
				<img
					v-else
					data-fancybox="gallery"
					:src="image.url"
				/>
				<div
					v-if="!(isImagesMoreThenShown && idx === 3)"
					class="image-message__info"
				>
					<div class="image-message__time">
						{{ moment(image.date)?.format("H:mm") }}
					</div>
					<ViewedMessageIcon
						v-if="isImageViewed(image) && !otherMessage"
						style="color: #fff"
					/>
					<ReceivedMessageIcon
						v-if="isImageReceived(image) && !otherMessage"
						style="color: #fff"
					/>
				</div>
			</div>
		</div>
		<div
			v-if="message.comment"
			class="image-message__text"
			:style="{
				textAlign: otherMessage ? 'right' : 'left',
			}"
		>
			<div v-html="message.comment!.replace(/\n/g, '<br>')" />
			<div
				v-if="message.comment"
				class="image-message__comment-info"
			>
				<div class="image-message__comment-data">
					{{ messageTime() }}
				</div>
				<ViewedMessageIcon
					v-if="isMessageViewed && !otherMessage"
					style="color: #27ae60"
				/>
				<ReceivedMessageIcon
					v-if="isMessageReceived && !otherMessage"
					style="color: #27ae60"
				/>
			</div>
		</div>
	</FansyBox>
</template>

<style scoped lang="scss">
	@import "./ImageMessage";
</style>
