<script setup lang="ts">
	import { useWindowSize } from "@vueuse/core";
	import { computed, onMounted, watch } from "vue";
	import { useRoute, useRouter } from "vue-router";
	import { ERouteName } from "~/shared/routes";

	import { AllChats, ChatWindow, ChatLoader, GroupAddUserModal, AdditionalInfoModal, GroupChatCreateEditModal, MessagesTypesModal, DatePickModal } from "~/components";

	import { useChatsStore } from "~/store/chats";
	import { useSettingsStore } from "~/store/settings";
	import Empty from "~/components/chat/ui/Empty/Empty.vue";
	import moment from "moment";

	definePageMeta({
		name: ERouteName.PAGE_HOME,
	});

	/** Отключение скролла */
	onMounted(() => {
		document.addEventListener("touchmove", function (e) {
			e.preventDefault();
		});

		document.body.addEventListener("touchstart", function (e) {
			const target = e.currentTarget as unknown as HTMLBodyElement;
			if (target.scrollTop === 0) {
				target.scrollTop = 1;
			} else if (target.scrollHeight === target.scrollTop + target.offsetHeight) {
				target.scrollTop -= 1;
			}
		});

		document.body.addEventListener("touchmove", function (e) {
			e.stopPropagation();
		});
	});

	/** Маршрутризатор */
	const router = useRouter();
	const route = useRoute();

	/**
	 * Подюклчение стора с сообщениями
	 */
	const chatsStore = useChatsStore();
	const { isAddUserModalOpen, isDetailedInfoModalOpen, isGroupChatEditModalOpen, isGroupChatCreateModalOpen, isOpenMessageTypeModal, isDatePickModalOpen, chats, openedChatId, openedChatData, chatsNotMyMessagesCount, filteredChats, getChat } = storeToRefs(chatsStore);
	const { raiseChat } = chatsStore;
	/**
	 * Подюклчение стора с настройками
	 */
	const settingsStore = useSettingsStore();
	const { isMobileSize, isChatsShown, isLoading, heightWithKeyboard } = storeToRefs(settingsStore);

	/**
	 * Хук для отслеживания ширины экрана
	 */
	const { width } = useWindowSize();

	/**
	 * Открыта ли любая моадка
	 */
	const isAnyModalOpen = computed(() => {
		return isAddUserModalOpen.value || isDetailedInfoModalOpen.value || isGroupChatEditModalOpen.value || isOpenMessageTypeModal.value || isGroupChatCreateModalOpen.value || isDatePickModalOpen.value;
	});

	/**
	 * Показывать ли модалку с дополнительной информацией
	 */
	const isAdditionalInfoModalVisible = computed(() => {
		return isDetailedInfoModalOpen.value && !isAddUserModalOpen.value && !isGroupChatEditModalOpen.value && !isGroupChatCreateModalOpen.value && !isOpenMessageTypeModal.value && !isDatePickModalOpen.value;
	});
	/**
	 * Высота блока на весь экран
	 */
	const windowHeight = ref();

	/**
	 * Подписка на измнение открытого чата
	 */
	watch(
		() => openedChatId.value,
		async () => {
			if (!openedChatId.value) {
				await router.replace({ path: "/" });
				return;
			}
			if (openedChatId.value !== route.query?.chatId) {
				await router.replace({ path: "/", query: { chatId: openedChatId.value } });
			}
		}
	);

	const playReceiveMessage = () => {
		const audio = new Audio("/audio/receive-msg.wav");
		audio.src = "/audio/receive-msg.wav";
		audio.volume = 0.2;
		audio.play();
	};

	// Поднятие вверх чата с новыми сообщениями
	for (let chat of chats.value) {
		const chatCount = computed(() => getChat.value(chat.id).messages.length);
		watch(
			() => chatCount.value,
			(newValCount, oldValCount) => {
				if (newValCount > oldValCount) {
					raiseChat(chat.id);
				}
			},
			{
				deep: true,
			}
		);
	}

	// Подсветка нового непрочитанного чата и звуковое уведомление
	for (let chat of chats.value) {
		const chatRef = computed(() => getChat.value(chat.id));
		const chatNotMyMessagesCount = computed(() => getChat.value(chat.id).messages.filter(msg => msg.isUnread));
		watch(
			() => chatNotMyMessagesCount.value,
			(newValCount, oldValCount) => {
				if (newValCount > oldValCount) {
					if (!chatRef.value.isMutedOff) {
						playReceiveMessage();
						chatRef.value.isNewMessage = true;
						setTimeout(() => {
							chatRef.value.isNewMessage = false;
						}, 1000);
					}
				}
			}
		);
	}

	// Тестовое новое сообщение
	onMounted(() => {
		setInterval(() => {
			chats.value[0].messages.push({
				id: new Date().getTime(),
				type: "text",
				message: "Принимаете заказ?",
				userId: 2,
				isReceived: false,
				isViewed: false,
				isUnread: true,
				date: moment().toISOString(),
			});
		}, 10000);
		// setInterval(() => {
		// 	chats.value[7].isGroupChat
		// 		? chats.value[7].messages.push({
		// 				id: new Date().getTime(),
		// 				type: "text",
		// 				firstName: "Женя",
		// 				secondName: "Иванов",
		// 				message: "Принимаете заказ?",
		// 				userId: 2,
		// 				isReceived: false,
		// 				isViewed: false,
		// 				isUnread: true,
		// 				date: moment().toISOString(),
		// 		  })
		// 		: chats.value[7].messages.push({
		// 				id: new Date().getTime(),
		// 				type: "text",
		// 				message: "Принимаете заказ?",
		// 				userId: 2,
		// 				isReceived: false,
		// 				isViewed: false,
		// 				isUnread: true,
		// 				date: moment().toISOString(),
		// 		  });
		// }, 1000);
	});

	/**
	 * После монтирования компоненты
	 */
	onMounted(async () => {
		// chatsStore.$patch(state => (state.filteredChats = state.chats));

		// windowHeight.value = `${window.visualViewport.height - 15}px`;

		checkMobileSize();
		window.addEventListener("resize", checkMobileSize);

		settingsStore.$patch(state => (state.isLoading = false));

		if (route.query?.chatId) {
			isChatsShown.value = false;
			await chatsStore.$patch(state => (state.openedChatId = +route.query.chatId));
		} else {
			isChatsShown.value = true;
		}
		// else {
		// 	await router.replace({ path: "/", query: { chatId: chats.value[0].id } });
		// 	chatsStore.$patch(state => (state.openedChatId = chats.value[0].id));
		// }
	});

	/**
	 * Максимальная ширина экрана допустимая для мобилбной версии
	 */
	const maxWindowWidthForMobile = 950;
	/**
	 * Превышает ли ширина экрана максимальную ширина экрана допустимая для мобилбной версии
	 */
	const checkMobileSize = () => {
		settingsStore.$patch(state => (state.isMobileSize = window.innerWidth < maxWindowWidthForMobile));
		windowHeight.value = `${window.visualViewport.height}px`;
	};
	/**
	 * Закрыть все открытые моадбные окна
	 * @param _event
	 */
	const closeAllModal = (_event: MouseEvent) => {
		console.log(123);

		_event.preventDefault();

		chatsStore.closeAddUserModal();
		chatsStore.closeDetailedModal();
		chatsStore.closeGroupChatEditModal();
		chatsStore.closeGroupChatCreateModal();
		chatsStore.closeMessageTypeModal();
		chatsStore.closeDatePickModal();
	};
</script>

<template>
	<ChatLoader v-if="isLoading" />

	<div
		v-else
		class="chat"
	>
		<AllChats
			v-if="(width < maxWindowWidthForMobile && isChatsShown) || !isMobileSize"
			class="chat__users"
			:class="{
				chat__users_mobile: isMobileSize,
			}"
			:style="{
				height: heightWithKeyboard,
			}"
		/>
		<ChatWindow
			v-if="openedChatId && ((isMobileSize && !isChatsShown) || !isMobileSize)"
			class="chat__window"
			:class="{
				chat__window_mobile: isMobileSize,
			}"
			:style="{
				// height: windowHeight,
			}"
		/>
		<Empty
			class="chat__empty"
			v-else
			>Выберите сообщение</Empty
		>

		<div
			v-if="isAnyModalOpen"
			class="modal__bg"
			@click="closeAllModal($event)"
		>
			<div
				class="modal__bg-overlay"
				@click="closeAllModal($event)"
			>
				<div
					v-if="!isMobileSize"
					class="modal__bg-padding"
				/>

				<DatePickModal v-if="isDatePickModalOpen" />
				<AdditionalInfoModal v-if="isAdditionalInfoModalVisible" />
				<GroupChatCreateEditModal v-if="isGroupChatEditModalOpen && !isAddUserModalOpen" />
				<GroupChatCreateEditModal v-if="isGroupChatCreateModalOpen && !isAddUserModalOpen" />
				<GroupAddUserModal v-if="isAddUserModalOpen" />

				<MessagesTypesModal v-if="isOpenMessageTypeModal" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import "index.scss";
</style>
