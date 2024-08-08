<script setup lang="ts">
	import type { GroupChatMessageType, MessageType } from "~/types/messages";

	import { useSettingsStore } from "~/store/settings";
	import { TextMessage, ImageMessage, VoiceMessage, FileMessage } from "~/components";

	/**
	 * Входящие пропсы
	 */
	interface PropsType {
		message: GroupChatMessageType | MessageType;
		lastOfSeveralMsgs: boolean;
	}

	const props = defineProps<PropsType>();
	const { message, lastOfSeveralMsgs } = toRefs(props);

	/**
	 * Подключение стора с настройками
	 */
	const settingsStore = useSettingsStore();
	const { isMobileSize } = storeToRefs(settingsStore);
</script>

<template>
	<div
		class="own-msg"
		:class="{
			'own-msg__triangle': (lastOfSeveralMsgs && message.type !== 'image') || (lastOfSeveralMsgs && message.type === 'image' && message.comment),
			'own-msg_mobile': isMobileSize,
		}"
		:style="{
			boxShadow: message.type === 'image' && 'none',
			marginBottom: lastOfSeveralMsgs ? '25px' : '5px',
		}"
	>
		<TextMessage
			v-if="message.type === 'text'"
			:last-of-several-msgs="lastOfSeveralMsgs"
			:message="message"
			:other-message="false"
		/>

		<ImageMessage
			v-if="message.type === 'image' || message.type === 'video'"
			:message="message"
			:other-message="false"
		/>

		<VoiceMessage
			v-if="message.type === 'voice'"
			:message="message"
			:other-message="false"
		/>

		<FileMessage
			v-if="message.type === 'file'"
			:message="message"
			:other-message="false"
		/>
	</div>
</template>

<style scoped lang="scss">
	@import "OwnMessage";
</style>
