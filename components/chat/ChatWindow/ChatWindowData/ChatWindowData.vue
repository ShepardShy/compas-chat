<script setup lang="ts">
	import GroupChatIcon from "assets/icons/group-chat-icon.svg";
	import { ChatPhoto } from "~/components";

	import { useChatsStore } from "~/store/chats";
	import { useSettingsStore } from "~/store/settings";
	import { useModalStore } from "~/store/modal";

	/**
	 * Подключение стора с чатами
	 */
	const chatsStore = useChatsStore();
	const { openedChatData } = storeToRefs(chatsStore);
	/**
	 * Подключение стора с настройками
	 */
	const settingsStore = useSettingsStore();
	const { isMobileSize } = storeToRefs(settingsStore);
	const modalStore = useModalStore();

	/**
	 * Если чат групповой - заголовок, иначе полное имя пользователя
	 */
	const userFullName = computed<string>(() => {
		if (openedChatData.value?.isGroupChat) {
			return openedChatData.value.title;
		} else if (openedChatData.value.firstName) {
			return openedChatData.value?.firstName + " " + openedChatData.value?.secondName;
		} else {
			return openedChatData.value?.secondName;
		}
	});
	/**
	 *  Итого участников группового чата
	 */
	const setUsersQuantity = computed(() => {
		const _totalChatUsers = openedChatData.value.users?.length.toString();
		const _lastDigit = +_totalChatUsers.slice(-1);

		if (_lastDigit === 1) {
			return `${_totalChatUsers} участник`;
		} else if (_lastDigit >= 2 && _lastDigit <= 4) {
			return `${_totalChatUsers} участника`;
		} else {
			return `${_totalChatUsers} участников`;
		}
	});
</script>

<template>
	<div class="window__user-data">
		<ChatPhoto
			:is-pinned="openedChatData.isPinned"
			:photo="openedChatData.photo"
			:is-active="openedChatData.isActive"
			:chat-name="userFullName"
			:chat-id="openedChatData.id"
			:is-group-chat="openedChatData.isGroupChat"
			:is-open-dialog-image="true"
		/>

		<div class="user__user-data">
			<div
				class="user__name-status"
				:class="{
					'user__name-status_mobile': isMobileSize,
				}"
			>
				<GroupChatIcon
					v-if="openedChatData.isGroupChat"
					class="group__title-icon"
				/>

				<div
					class="user__name"
					@click="!openedChatData.isGroupChat && modalStore.showModal()"
					:class="{
						'user__name_is-group': openedChatData.isGroupChat,
					}"
				>
					{{ userFullName }}
				</div>

				<div
					v-if="!openedChatData.isGroupChat"
					class="user__status"
				>
					{{ openedChatData.isActive ? "В сети" : "Не в сети" }}
				</div>
			</div>

			<div
				v-if="!openedChatData.isGroupChat"
				class="user__position"
			>
				{{ openedChatData.position ?? "" }}
			</div>

			<div
				v-if="openedChatData.isGroupChat"
				class="user__chat-users"
			>
				{{ setUsersQuantity }}
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "ChatWindowData";
</style>
