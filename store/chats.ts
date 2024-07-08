import { defineStore } from "pinia";
import type { MessagesTypesType, GroupChatType, UserChatType } from "~/types/messages";
import { formattedDateToday, setFileSize } from "~/composables/chats";
import { chats } from "./test/chats";
import { testTextMessages } from "./test/textMessages";
import { testPhotoMessages } from "./test/photoMessages";

export const useChatsStore = defineStore("chats", {
	state: () => {
		return {
			userId: 1,
			chats: chats as Array<UserChatType | GroupChatType>,
			filteredChats: [] as Array<UserChatType | GroupChatType> | [],
			openedChatId: undefined as undefined | number,

			chatIdForOpenModal: undefined as undefined | number,
			isDetailedInfoModalOpen: false,
			isAddUserModalOpen: false,
			isGroupChatEditModalOpen: false,
			isGroupChatCreateModalOpen: false,
			isDatePickModalOpen: false,

			openMessageTypeModal: undefined as undefined | MessagesTypesType,
			isOpenMessageTypeModal: false,
			dataFromSelectedTypeOfChatMessage: [] as unknown[],

			temporalStorageForGroupChat: {
				title: "",
				photo: "",
				users: [],
			},

			temporalStorageForDeletedUsers: [],
			temporalStorageForAddedUsers: [],

			testTextMessages: testTextMessages,
			testPhotoMessages: testPhotoMessages,

			openMessageTypeItem: null,
		};
	},

	getters: {
		chatsWithPinnedUsers: state => state.filteredChats.filter(chat => chat.isPinned),
		chatsWithoutPinned: state => state.filteredChats.filter(chat => !chat.isPinned),
		openedChatData: (state): UserChatType | GroupChatType | undefined => {
			const chatData = state.chats.find(chat => chat.id === state.openedChatId);
			const messages = chatData?.messages;
			const preparedMessages: Array<{ date: string; messages: UserChatType | GroupChatType | undefined }> = [];

			for (let i = 0; i < messages?.length; i++) {
				if (i === 0) {
					preparedMessages.push({
						date: messages[i]?.date?.slice(0, 10),
						messages: [messages[i]],
					});
				} else if (messages[i]?.date.slice(0, 10) === preparedMessages[preparedMessages.length - 1].date) {
					preparedMessages[preparedMessages.length - 1].messages.push(messages[i]);
				} else {
					preparedMessages.push({
						date: messages[i]?.date.slice(0, 10),
						messages: [messages[i]],
					});
				}
			}

			return {
				...chatData,
				messages: preparedMessages,
			};
		},
		openModalChatData: (state): UserChatType | GroupChatType | undefined => state.chats.find(chat => chat.id === state.chatIdForOpenModal),
		allChatUsers: state => state.chats.filter(chat => !chat.isGroupChat),
	},

	actions: {
		async togglePinUser(chatId: string | number) {
			try {
				this.chats = this.chats.map(chatData => {
					if (chatData.id == chatId) {
						return {
							...chatData,
							isPinned: !chatData.isPinned,
						};
					} else {
						return chatData;
					}
				});
			} catch (e) {
				console.log(e);
			}
		},

		async toggleUserMuted(chatId: string | number) {
			try {
				this.chats = this.chats.map(chatData => {
					if (chatData.id == chatId) {
						return {
							...chatData,
							isMutedOff: !chatData.isMutedOff,
						};
					} else {
						return chatData;
					}
				});
			} catch (e) {
				console.log(e);
			}
		},

		async filterChats(chatSearch: string) {
			try {
				if (!chatSearch) {
					this.filteredChats = [...this.chats];
					return;
				}
				this.filteredChats = [];
				const l = (string: string) => string?.toLowerCase();

				// Поиск по имени и фамилии
				const chatsWithNames = [
					...this.chats.filter(chatData => {
						const isChatNameIncludes = l(chatData?.firstName)?.includes(l(chatSearch)) || l(chatData?.secondName)?.includes(l(chatSearch)) || l(chatData?.title)?.includes(l(chatSearch));
						if (isChatNameIncludes) {
							return true;
						}
					}),
				];

				// Поиск по сообщениям
				const chatsWithMessages = [];

				this.filteredChats = [...chatsWithNames, ...chatsWithMessages];
			} catch (e) {
				console.log(e);
			}
		},

		async deleteChat(chatId: string | number) {
			try {
				this.chats = this.chats.filter(chat => chat.id !== chatId);
				this.openedChatId = this.chats[0].id ?? undefined;
			} catch (e) {
				console.log(e);
			}
		},

		async addToGroup(userId: number, groupId: number) {
			const userData = this.chats.find(chat => chat.id === userId && !chat.isGroupChat);

			this.chats = this.chats.map(chat => {
				if (!chat.isGroupChat) {
					return chat;
				}

				if (chat.id === groupId) {
					return {
						...chat,
						users: [userData, ...(chat as GroupChatType).users],
					};
				} else {
					return chat;
				}
			});
		},

		async removeFromGroup(userId: number, groupId: number) {
			this.chats = this.chats.map(chat => {
				if (!chat.isGroupChat) {
					return chat;
				}

				if (chat.id === groupId) {
					return {
						...chat,
						users: (chat as GroupChatType).users.filter(user => userId !== user.id),
					};
				} else {
					return chat;
				}
			});
		},

		clearChatIdForOpenModal() {
			this.chatIdForOpenModal = undefined;
		},

		closeDetailedModal() {
			this.isDetailedInfoModalOpen = false;
		},

		closeAddUserModal() {
			this.isAddUserModalOpen = false;
		},

		closeDatePickModal() {
			this.isDatePickModalOpen = false;
		},

		closeGroupChatEditModal() {
			this.isGroupChatEditModalOpen = false;
		},

		closeMessageTypeModal() {
			this.isOpenMessageTypeModal = false;
		},

		updateGroupChat(newChatData: GroupChatType) {
			this.chats = this.chats.map(chat => {
				if (!chat.isGroupChat) {
					return chat;
				}

				if (chat.id === newChatData.id) {
					return newChatData;
				} else {
					return chat;
				}
			});
		},

		clearDataFromSelectedTypeOfChatMessage() {
			this.dataFromSelectedTypeOfChatMessage = [];
		},

		getTextMessages() {
			this.dataFromSelectedTypeOfChatMessage = [...this.testTextMessages];
		},

		getPhotoMessages() {
			this.dataFromSelectedTypeOfChatMessage = [...this.testPhotoMessages];
		},

		closeGroupChatCreateModal() {
			this.isGroupChatCreateModalOpen = false;
		},

		clearTemporalStorageForNewGroupChat() {
			this.temporalStorageForGroupChat = {
				title: "",
				photo: "",
				users: [],
			};
		},

		updateTemporalStorageForGroupChat(temporalChatData: { title: string; photo: string; users: never[] }) {
			this.temporalStorageForGroupChat = {
				...temporalChatData,
			};
		},

		sendTextMessage(message: string, userId: number, chatId: number) {
			const userData = this.allChatUsers.find(user => user.id === userId);
			const newMessage = {
				id: formattedDateToday(),
				userId,
				type: "text",
				firstName: userData!.firstName ?? "",
				secondName: userData!.secondName ?? "",
				message: message ? message?.replace(/\n/g, "\n") : "",
				date: formattedDateToday(),
				isReceived: true,
				isViewed: false,
				isUnread: false,
			};

			this.chats = this.chats.map(chat => {
				if (chat.id === chatId) {
					return {
						...chat,
						messages: [...chat.messages, newMessage],
					};
				} else {
					return chat;
				}
			});
		},

		sendImageMessage(uploadedImages: Array<unknown>, message: string, userId: number, chatId: number) {
			const userData = this.allChatUsers.find(user => user.id === userId);
			const newMessage = {
				id: formattedDateToday(),
				userId,
				type: "image",
				firstName: userData!.firstName ?? "",
				secondName: userData!.secondName ?? "",
				comment: message ? message?.replace(/\n/g, "\n") : "",
				date: formattedDateToday(),
				isReceived: true,
				isViewed: false,
				isUnread: false,
				images: [
					...uploadedImages.map(image => {
						return {
							url: image.url,
							fileName: image.fileName,
							date: formattedDateToday(),
							isReceived: true,
							isViewed: false,
							isUnread: false,
						};
					}),
				],
			};

			this.chats = this.chats.map(chat => {
				if (chat.id === chatId) {
					return {
						...chat,
						messages: [...chat.messages, newMessage],
					};
				} else {
					return chat;
				}
			});
		},

		sendFileMessage(
			uploadedFiles: Array<{
				url: string;
				name: string;
				size: string;
			}>,
			message: string,
			userId: number,
			chatId: number
		) {
			const userData = this.allChatUsers.find(user => user.id === userId);

			const newMessage = {
				id: formattedDateToday(),
				userId,
				type: "file",
				firstName: userData!.firstName ?? "",
				secondName: userData!.secondName ?? "",
				comment: message ? message?.replace(/\n/g, "\n") : "",
				date: formattedDateToday(),
				isReceived: true,
				isViewed: false,
				isUnread: false,
				files: [
					...uploadedFiles.map(file => {
						return {
							url: file.url,
							fileName: file.name,
							size: file.size,
							date: formattedDateToday(),
							isReceived: true,
							isViewed: false,
							isUnread: false,
						};
					}),
				],
			};

			this.chats = this.chats.map(chat => {
				if (chat.id === chatId) {
					return {
						...chat,
						messages: [...chat.messages, newMessage],
					};
				} else {
					return chat;
				}
			});
		},

		sendVoiceMessage(uploadedVoiceMessages: string[], message: string, userId: number, chatId: number) {
			const userData = this.allChatUsers.find(user => user.id === userId);

			const newMessage = {
				id: formattedDateToday(),
				userId,
				type: "voice",
				firstName: userData!.firstName ?? "",
				secondName: userData!.secondName ?? "",
				comment: message,
				date: formattedDateToday(),
				isReceived: true,
				isViewed: false,
				isUnread: false,
				voice: [
					...uploadedVoiceMessages.map(file => {
						return {
							url: file,
							date: formattedDateToday(),
							isReceived: true,
							isViewed: false,
							isUnread: false,
						};
					}),
				],
			};

			this.chats = this.chats.map(chat => {
				if (chat.id === chatId) {
					return {
						...chat,
						messages: [...chat.messages, newMessage],
					};
				} else {
					return chat;
				}
			});
		},

		createGroupChat() {
			const currentUser: UserChatType = this.chats.find(chat => chat.id === this.userId && !chat.isGroupChat);
			const fullUserName = currentUser.firstName ? currentUser.firstName + " " + currentUser.secondName : currentUser.secondName;

			const _addedUsersListArray = this.temporalStorageForAddedUsers.map(user => {
				if (user.firstName) {
					return user.firstName + " " + user.secondName;
				} else {
					return user.secondName || "";
				}
			});

			const _addedUsersList = _addedUsersListArray.join(", ");

			const addedUsersMessage = this.temporalStorageForAddedUsers.length > 1 ? `Добавлены в групповой чат: ${_addedUsersList}` : `Добавлен в группвой чат: ${_addedUsersList} `;

			const newGroupChat: GroupChatType = {
				...this.temporalStorageForGroupChat,
				id: this.chats.length + 1,
				isGroupChat: true,
				isPinned: false,
				isTyping: false,
				isMutedOff: false,
				totalTextMessages: 0,
				totalPhotoMessages: 0,
				totalVideoMessages: 0,
				totalFileMessages: 0,
				totalVoiceMessages: 0,
				totalLinksMessages: 0,
				users: [...this.temporalStorageForGroupChat.users, ...this.temporalStorageForAddedUsers],
				messages: [
					{
						id: 33,
						type: "message-info",
						message: `${fullUserName} создал(а) групповой чат`,
						date: formattedDateToday(),
					},
				],
			};

			if (this.temporalStorageForAddedUsers.length) {
				newGroupChat.messages.push({
					id: formattedDateToday() as unknown as number,
					type: "message-info",
					message: addedUsersMessage,
					date: formattedDateToday(),
				});
			}

			this.chats = [newGroupChat, ...this.chats];
			this.openedChatId = newGroupChat.id;

			this.clearTemporalStorageForNewGroupChat();
			this.closeGroupChatCreateModal();
		},

		saveTextMessageDraft(chatId: number, textMessageDraft: string) {
			this.chats = this.chats.map(chat => {
				if (chat.id === chatId) {
					return {
						...chat,
						textMessageDraft,
					};
				} else {
					return chat;
				}
			});
		},
	},
});
