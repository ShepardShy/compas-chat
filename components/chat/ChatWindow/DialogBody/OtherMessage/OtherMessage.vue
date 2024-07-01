<script setup lang="ts">
	import type { GroupChatMessageType, MessageType, UserChatType } from "~/types/messages";
	import { useChatsStore } from "~/store/chats";
	import { useSettingsStore } from "~/store/settings";
	import { TextMessage, ImageMessage, FileMessage } from "~/components";
	import VoiceMessage from "~/components/chat/ChatWindow/DialogBody/MessageTypes/VoiceMessage/VoiceMessage.vue";
	import { useModalStore } from "~/store/modal";

	/**
	 * Входящие пропсы
	 */
	interface PropsType {
		message: GroupChatMessageType | MessageType;
		lastOfSeveralMsgs: boolean;
		firstOfSeveralMsgs: boolean;
		isShowName: boolean;
	}

	const props = defineProps<PropsType>();
	const { message, lastOfSeveralMsgs, firstOfSeveralMsgs, isShowName } = toRefs(props);

	/**
	 * Подклбчение стора с чатами
	 */
	const chatsStore = useChatsStore();
	const { chats } = storeToRefs(chatsStore);
	/**
	 * Подклбчение стора с настройками
	 */
	const settingsStore = useSettingsStore();
	const { isMobileSize } = storeToRefs(settingsStore);

	/***
	 * Получение данных о о=пользователе открытого чата
	 */
	const chatUser = computed<UserChatType>(() => chats.value.find(chat => chat.userId === message.value.userId));

	/***
	 * Фото пользователя или если его нет заливка гралиентом
	 */
	const chatPhoto = computed<string>(() => {
		if (!lastOfSeveralMsgs.value) return "none";

		if (chatUser.value.photo) {
			return `url(${chatUser.value.photo})`;
		} else {
			return "linear-gradient(to bottom, #71d2fc 2%, #9490ff 100%)";
		}
	});

	const modalStore = useModalStore();
</script>

<template>
	<div
		class="other-msg"
		:class="{
			'other-msg_mobile': isMobileSize,
		}"
		:style="{
			marginBottom: lastOfSeveralMsgs ? '25px' : '5px',
			maxWidth: message.type === 'image' && isMobileSize && '335px',
		}"
	>
		<div
			class="other-msg__photo"
			:class="{
				'other-msg__photo_mobile': isMobileSize,
			}"
			:style="{
				backgroundImage: chatPhoto,
			}"
		>
			<div
				v-if="!chatUser.photo && lastOfSeveralMsgs"
				class="other-msg__first-name-letter"
			>
				{{ chatUser?.firstName ? chatUser?.firstName[0] : "" }}
			</div>
		</div>

		<div
			class="other-msg__body"
			:class="{
				'other-msg__triangle ': (lastOfSeveralMsgs && message.type !== 'image') || (lastOfSeveralMsgs && message.type === 'image' && message.comment),
			}"
		>
			<p
				@click="() => modalStore.showModal()"
				v-if="firstOfSeveralMsgs && isShowName"
				class="other-msg__name"
			>
				{{ `${chatUser?.firstName} ${chatUser?.secondName}` }}
			</p>
			<TextMessage
				v-if="message.type === 'text'"
				:message="message"
				:other-message="true"
			/>

			<ImageMessage
				v-if="message.type === 'image'"
				:message="message"
				:other-message="true"
			/>

			<FileMessage
				v-if="message.type === 'file'"
				:message="message"
				:other-message="true"
			/>

			<VoiceMessage
				v-if="message.type === 'voice'"
				:message="message"
				:other-message="true"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "OtherMessage";
</style>
