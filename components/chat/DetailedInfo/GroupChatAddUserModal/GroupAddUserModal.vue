<script setup lang="ts">
	import AppH3 from "~/components/ui/AppH3/AppH3.vue";
	import BackIcon from "assets/icons/back-icon.svg";
	import CloseIcon from "assets/icons/close-icon.svg";
	import { ChatInput, GroupChatUser } from "~/components";
	import moment from "moment";

	import { useChatsStore } from "~/store/chats";
	import { useSettingsStore } from "~/store/settings";
	import type { GroupChatUserType } from "~/types/messages";
	import AppButton from "~/components/ui/AppButton/AppButton.vue";
	import { formattedDateToday } from "~/composables/chats";

	/**
	 * Подключение стора с чатами
	 */
	const chatsStore = useChatsStore();
	const { allChatUsers, temporalStorageForGroupChat, isDetailedInfoModalOpen, chats, openedChatData, isGroupChatCreateModalOpen } = storeToRefs(chatsStore);
	/**
	 * Подключение стора с настройками
	 */
	const settingsStore = useSettingsStore();
	const { isMobileSize } = storeToRefs(settingsStore);

	/**
	 * Поиск пользователя
	 */
	const userSearchInputValue = ref();
	/**
	 * Локальное хранилище для чата
	 */
	const allChatDataLocal = ref();
	/**
	 * Удаленные пользователи
	 */
	const deletedUsersLocal = ref<Array<unknown>>([]);
	/**
	 * Добавленные пользователи
	 */
	const addedUsersLocal = ref<Array<unknown>>([]);

	/**
	 * Все пользователи приложения + пользователи чата
	 */
	const preparedChatUsers = computed(() => {
		if (isGroupChatCreateModalOpen.value) {
			return [...allChatUsers.value];
		}

		const _currentChatUsersId = [...openedChatData.value!.users].map(user => user.userId);
		const _allUsersToChoose = [...openedChatData.value!.users];
		const _allAppUsers = [...allChatUsers.value];

		for (let i = 0; i < _allAppUsers.length; i++) {
			if (!_currentChatUsersId.includes(_allAppUsers[i].userId)) {
				_allUsersToChoose.push(allChatUsers.value[i]);
			}
		}

		if (userSearchInputValue.value) {
			return _allUsersToChoose.filter(user => user.firstName.toLowerCase().includes(userSearchInputValue.value.toLowerCase()) || user.secondName.toLowerCase().includes(userSearchInputValue.value.toLowerCase()));
		}

		return _allUsersToChoose;
	});

	/**
	 * Монтирование компоненты
	 */
	onMounted(() => {
		allChatDataLocal.value = temporalStorageForGroupChat.value;
	});

	/**
	 * Закрыть модлаку
	 */
	const closeModal = () => {
		addedUsersLocal.value = [];
		deletedUsersLocal.value = [];
		chatsStore.closeAddUserModal();
	};
	/**
	 * Закрыть все модалки
	 */
	const closeAllModals = () => {
		chatsStore.closeDetailedModal();
		chatsStore.closeAddUserModal();
		chatsStore.clearChatIdForOpenModal();
	};
	/**
	 * Добавить пользователя в локальное хранилище данных
	 * @param _userData
	 */
	const addToGroup = (_userData: GroupChatUserType) => {
		const idDeletedUsers = deletedUsersLocal.value.map(user => user.id);

		if (idDeletedUsers.includes(_userData.id)) {
			deletedUsersLocal.value = deletedUsersLocal.value.filter(user => user.id !== _userData.id);
		}

		addedUsersLocal.value = [...addedUsersLocal.value, _userData];

		allChatDataLocal.value = {
			...allChatDataLocal.value,
			users: [...allChatDataLocal.value.users, _userData],
		};
	};
	/**
	 * Убрать пользователя из локального хранилище данных
	 * @param _userData
	 */
	const removeFromGroup = (userId: number | string) => {
		const userToDelete = allChatDataLocal.value.users.find(user => user.id === userId);
		deletedUsersLocal.value = [...deletedUsersLocal.value, userToDelete];

		const idAddedUsers = addedUsersLocal.value.map(user => user.id);
		if (idAddedUsers.includes(userId)) {
			addedUsersLocal.value = addedUsersLocal.value.filter(user => user.id !== userId);
		}

		allChatDataLocal.value = {
			...allChatDataLocal.value,
			users: allChatDataLocal.value.users.filter(user => user.id !== userId),
		};
	};
	/**
	 * Сохранить добавление/удаление пользователей во временное хранилице в сторе
	 */
	const saveChanges = async () => {
		if (isDetailedInfoModalOpen.value) {
			if (deletedUsersLocal.value.length) {
				await saveDeletedUsers();
			}
			if (addedUsersLocal.value.length) {
				await saveAddedUsers();
			}
		} else {
			await chatsStore.$patch(
				state =>
					(state.temporalStorageForGroupChat = {
						...allChatDataLocal.value,
					})
			);
			await chatsStore.$patch(state => (state.temporalStorageForDeletedUsers = [...state.temporalStorageForDeletedUsers, ...deletedUsersLocal.value]));
			await chatsStore.$patch(state => (state.temporalStorageForAddedUsers = [...state.temporalStorageForAddedUsers, ...addedUsersLocal.value]));
		}

		closeModal();
	};

	/**
	 * Сохранить удаление пользователей
	 */
	const saveDeletedUsers = async () => {
		if (isGroupChatCreateModalOpen.value) return;

		const _deletedUsersListArray = deletedUsersLocal.value.map(user => {
			if (user.firstName) {
				return user.firstName + " " + user.secondName;
			} else {
				return user.secondName || "";
			}
		});

		const _deletedUsersListList = _deletedUsersListArray.join(", ");

		const deleteMessage = _deletedUsersListArray.length > 1 ? `Удалены из грпуппового чата: ${_deletedUsersListList}` : `Удалён из группового чата: ${_deletedUsersListList}`;

		const _messages = chats.value.find(chat => chat.id === allChatDataLocal.value.id).messages;

		const preparedMessages = [
			..._messages,
			{
				id: moment().toISOString(),
				type: "message-info",
				message: deleteMessage,
				date: moment().toISOString(),
			},
		];

		if (deletedUsersLocal.value.length === 0) {
			await chatsStore.updateGroupChat(allChatDataLocal.value);
		} else {
			await chatsStore.updateGroupChat({
				...allChatDataLocal.value,
				messages: [...preparedMessages],
			});
		}
	};

	/**
	 * Сохранить добавление пользователей
	 */
	const saveAddedUsers = async () => {
		if (isGroupChatCreateModalOpen.value) return;

		const _addedUsersListArray = addedUsersLocal.value.map(user => {
			if (user.firstName) {
				return user.firstName + " " + user.secondName;
			} else {
				return user.secondName || "";
			}
		});

		const _addedUsersList = _addedUsersListArray.join(", ");

		const addMessage = _addedUsersListArray.length > 1 ? `Добавлены в групповой чат: ${_addedUsersList}` : `Добавлен в групповой чат: ${_addedUsersList}`;

		const _messages = chats.value.find(chat => chat.id === allChatDataLocal.value.id).messages;

		const preparedMessages = [
			..._messages,
			{
				id: 33,
				type: "message-info",
				message: addMessage,
				date: moment().toISOString(),
			},
		];

		if (addedUsersLocal.value.length === 0) {
			await chatsStore.updateGroupChat(allChatDataLocal.value);
		} else {
			await chatsStore.updateGroupChat({
				...allChatDataLocal.value,
				messages: [...preparedMessages],
			});
		}
	};
</script>

<template>
	<div
		@click.stop
		class="add-user"
		:class="{
			'add-user_mobile': isMobileSize,
		}"
	>
		<div
			class="add-user__modal"
			:class="{
				'add-user__modal_mobile': isMobileSize,
			}"
		>
			<BackIcon
				class="add-user__back-icon"
				@click.stop="closeModal"
			/>

			<AppH3 class="add-user__title"> Добавить в группу </AppH3>

			<CloseIcon
				class="add-user__close-icon"
				@click.stop="closeAllModals"
			/>

			<ChatInput
				v-model:inputValue="userSearchInputValue"
				class="add-user__search-input"
				placeholder="Найти"
			/>

			<div
				class="add-user__group-users-wrapper"
				:class="{
					'add-user__group-users-wrapper_mobile': isMobileSize,
				}"
			>
				<GroupChatUser
					v-for="user in preparedChatUsers"
					:key="user.id"
					:all-chat-data-local="allChatDataLocal"
					:user-data="user"
					:is-add-icon="true"
					@add-to-group="userData => addToGroup(userData)"
					@remove-from-group="userId => removeFromGroup(userId)"
				/>

				<div
					v-if="!preparedChatUsers.length"
					class="add-user__no-users"
				>
					Пользователь не найден
				</div>
			</div>

			<div class="add-user__btns">
				<AppButton
					class="add-user__btn"
					@click.stop="saveChanges"
				>
					Добавить
				</AppButton>
			</div>
		</div>

		<div
			v-if="!isMobileSize"
			class="add-user__bg-padding"
		/>
	</div>
</template>

<style lang="scss">
	@import "./GroupAddUserModal";
</style>
