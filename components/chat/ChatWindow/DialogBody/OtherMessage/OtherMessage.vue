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
		dialogWrapperScrollTop: number;
		dialogActionsHeight: string;
	}

	/**
	 * События
	 */
	const emit = defineEmits<{
		(emit: "update:shownDate", value: string): void;
	}>();

	const props = defineProps<PropsType>();
	const { message, lastOfSeveralMsgs, firstOfSeveralMsgs, isShowName, dialogWrapperScrollTop, dialogActionsHeight } = toRefs(props);

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
	const chatUser = computed<UserChatType>(() => (chats as globalThis.ComputedRef<UserChatType[]>).value.find((chat) => chat.userId === message.value.userId) as UserChatType);

	const modalStore = useModalStore();
	const isUnreadMessage = message.value.isUnread;

	// Просмотр сообщения

	// Выбираем элемент, за которым будем наблюдать
	const $otherMsg = ref(null);

	// Создаем callback-функцию, которая будет вызываться при пересечении
	const callback = (entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				setTimeout(() => {
					message.value.isUnread = false;
				}, 500);
				observer.unobserve(entry.target);
			}
		});
	};

	let observer;

	watch(
		() => dialogActionsHeight.value,
		() => {
			if (message.value.isUnread && observer) {
				observer.unobserve($otherMsg.value);
				observer = new IntersectionObserver(callback, {
					root: null, // null означает, что будем использовать viewport как область видимости
					rootMargin: `0px 0px -${dialogActionsHeight.value} 0px`,
					threshold: 0.6, // Процент видимости элемента, при котором будет вызван callback (0.1 = 10%)
				});
				observer.observe($otherMsg.value);
			}
		}
	);

	// Начинаем наблюдение за элементом
	onMounted(() => {
		if (message.value.isUnread) {
			setTimeout(() => {
				// Создаем экземпляр IntersectionObserver с указанным callback
				observer = new IntersectionObserver(callback, {
					root: null, // null означает, что будем использовать viewport как область видимости
					rootMargin: `0px 0px -${dialogActionsHeight.value} 0px`,
					threshold: 0.6, // Процент видимости элемента, при котором будет вызван callback (0.1 = 10%)
				});
				observer.observe($otherMsg.value);
			}, 500);
		}
	});
</script>

<template>
	<div
		class="other-msg"
		ref="$otherMsg"
		:class="{
			'other-msg_mobile': isMobileSize,
			'other-msg_unreaded': isUnreadMessage,
			'other-msg_unread': message.isUnread,
		}"
		:style="{
			marginBottom: lastOfSeveralMsgs ? '25px' : '5px',
			maxWidth: message.type === 'image' && isMobileSize && '335px',
		}"
	>
		<div
			class="other-msg__body"
			:class="{
				'other-msg__triangle ': (lastOfSeveralMsgs && message.type !== 'image') || (lastOfSeveralMsgs && message.type === 'image' && message.comment),
			}"
		>
			<p
				@pointerup.left.stop="() => chatsStore.openUser(chatUser?.userId)"
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
				v-if="message.type === 'image' || message.type === 'video'"
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

<style lang="scss">
	@import "OtherMessage";
</style>
