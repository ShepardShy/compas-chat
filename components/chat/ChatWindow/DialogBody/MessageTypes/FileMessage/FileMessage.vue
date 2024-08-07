<script setup lang="ts">
	import type { FileMessageType, GroupChatMessageType, MessageType } from "~/types/messages";
	import { useSettingsStore } from "~/store/settings";
	import ReceivedMessageIcon from "assets/icons/recieved-message-icon.svg";
	import ViewedMessageIcon from "assets/icons/viewed-message-icon.svg";
	import File from "./components/File/File.vue";
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
	const { isMobileSize } = storeToRefs(settingsStore);

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
</script>

<template>
	<div
		class="file-messages"
		:class="{
			'file-messages__mobile': isMobileSize,
		}"
	>
		<div
			v-for="file in message.files"
			class="file-messages__wrapper"
		>
			<File :file />
		</div>
		<div class="file-messages__comment-time">
			<div
				v-if="message.comment"
				class="file-messages__comment"
				v-html="message.comment!.replace(/\n/g, '<br>')"
			/>
			<div class="file-messages__time-status">
				<div class="file-messages__time">
					{{ moment(message.date)?.format("H:mm") }}
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
	</div>
</template>

<style scoped lang="scss">
	@import "./FileMessage";
</style>
