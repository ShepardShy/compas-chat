<script setup lang="ts">
	import { chatMenuItems } from "~/shared";

	import { useChatsStore } from "~/store/chats";
	import MuteOffIcon from "~/assets/icons/mute-off-icon.svg";
	import PinIcon from "~/assets/icons/pin-icon.svg";
	import type { ChatMenuType } from "~/types/messages";
	import { useSettingsStore } from "~/store/settings";

	/**
	 * Входящие пропсы
	 */
	interface PropsType {
		chatId: number | string | undefined;
		isPinned: boolean;
		isMutedOff: boolean;
		isUserChatLeft?: boolean;
		isGroupChat: boolean;
	}

	const props = defineProps<PropsType>();
	const { chatId, isPinned, isMutedOff, isGroupChat } = toRefs(props);

	/**
	 * События компонента
	 */
	const emit = defineEmits<{
		(emit: "closeChat"): void;
	}>();

	/**
	 * Подключение стора с настройками
	 */
	const settingsStore = useSettingsStore();
	const { isMobileSize } = storeToRefs(settingsStore);
	/**
	 * Подключение стора с чатами
	 */
	const chatsStore = useChatsStore();
	const { openedChatData } = storeToRefs(chatsStore);

	/** Открыто ли приложение в сафари */
	const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	/**
	 * Выбраный элемент меню чата
	 */
	const activeMenuItem = ref<string>();

	/**
	 * Элементы меню чата
	 */
	const chatItems = computed(() => {
		if (isGroupChat.value) {
			return chatMenuItems;
		} else {
			return chatMenuItems.filter(menuItems => menuItems.action !== "editChat");
		}
	});
	/**
	 * Событие при клике на элемент меню чата
	 * @param _menuItem
	 */
	const onClickDoMenuAction = async (_menuItem: ChatMenuType) => {
		activeMenuItem.value = _menuItem.title;

		switch (_menuItem.action) {
			case "pinChat": {
				await chatsStore.togglePinUser(chatId.value!);
				break;
			}
			case "detailedChatInfo": {
				chatsStore.$patch(state => (state.chatIdForOpenModal = chatId.value));

				await nextTick();
				await chatsStore.$patch(state => (state.temporalStorageForGroupChat = openedChatData.value));

				chatsStore.$patch(state => (state.isDetailedInfoModalOpen = true));

				emit("closeChat");
				break;
			}
			case "editChat": {
				await chatsStore.$patch(state => (state.chatIdForOpenModal = chatId.value));

				await nextTick();

				await chatsStore.$patch(state => (state.temporalStorageForGroupChat = openedChatData.value));
				chatsStore.$patch(state => (state.isGroupChatEditModalOpen = true));
				emit("closeChat");
				break;
			}
			case "deleteChat": {
				await chatsStore.deleteChat(chatId.value!);
				settingsStore.$patch(state => (state.isChatsShown = true));
				emit("closeChat");
				break;
			}
			case "muteChat": {
				await chatsStore.toggleUserMuted(chatId.value!);
				break;
			}
		}
	};
</script>

<template>
	<div
		class="menu"
		:class="{
			menu_mobile: isMobileSize,
		}"
	>
		<div
			v-for="item in chatItems"
			:key="item.title"
			class="menu__item"
			@pointerup.left.stop="onClickDoMenuAction(item)"
		>
			<div
				v-if="item.icon"
				class="menu__item-icon"
				:class="{
					'menu__item-icon_not-selected': (item.action == 'muteChat' && !isMutedOff) || (item.action == 'pinChat' && !isPinned),
				}"
			>
				<MuteOffIcon
					v-if="item.action == 'muteChat' && isMutedOff"
					class="menu__item-img"
				/>

				<PinIcon
					v-if="item.action == 'pinChat' && isPinned"
					class="menu__item-img"
				/>
			</div>

			<span
				class="menu__item-title"
				:style="{
					paddingTop: isSafari ? '2px' : '0',
				}"
			>
				{{ item.title }}
			</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "./ChatMenu.scss";
</style>
