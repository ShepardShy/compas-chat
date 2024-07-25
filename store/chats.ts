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
			// filteredChats: [] as Array<UserChatType | GroupChatType> | [],
			openedChatId: undefined as undefined | number,
			chatSearch: "" as string,

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
		getChat: state => id => state.chats?.find(chat => chat?.id == id),
		getChatIndex: state => id => state.chats?.findIndex(chat => chat?.id == id),
		chatsNotMyMessagesCount: state => {
			return state.chats.reduce((acc, chat) => {
				acc += chat.messages.filter(message => message.userId != state.userId)?.length;
				return acc;
			}, 0);
		},
		openedChatDataMessages: (state): UserChatType | GroupChatType | undefined => {
			const chatData = state.chats.find(chat => chat.id === state.openedChatId);
			const messages = chatData?.messages;
			return { messages };
		},
		openedChatData: (state): UserChatType | GroupChatType | undefined => {
			const chatData = state.chats.find(chat => chat.id === state.openedChatId);
			const messages = chatData?.messages;
			const preparedMessages: Array<{ date: string; messages: UserChatType | GroupChatType | undefined }> = [];

			if (messages) {
				for (let i = 0; i < messages.length; i++) {
					const messageDate = messages[i]?.date?.slice(0, 10);
					const userId = messages[i]?.userId;

					if (i === 0) {
						preparedMessages.push({
							date: messageDate,
							messages: [{ userId: userId, messages: [messages[i]] }],
						});
					} else {
						const lastPreparedMessage = preparedMessages[preparedMessages.length - 1];

						if (messageDate === lastPreparedMessage.date) {
							const userMessages = lastPreparedMessage.messages.find(m => m.userId === userId);

							if (userMessages) {
								userMessages.messages.push(messages[i]);
							} else {
								lastPreparedMessage.messages.push({ userId: userId, messages: [messages[i]] });
							}
						} else {
							preparedMessages.push({
								date: messageDate,
								messages: [{ userId: userId, messages: [messages[i]] }],
							});
						}
					}
				}
			}

			return {
				...chatData,
				messages: preparedMessages,
			};
		},
		openModalChatData: (state): UserChatType | GroupChatType | undefined => state.filteredChats.find(chat => chat.id === state.chatIdForOpenModal),
		allChatUsers: state => state.chats.filter(chat => !chat.isGroupChat),
		filteredChats: state => {
			try {
				if (!state.chatSearch) {
					return [...state.chats];
				}
				// this.filteredChats = [];
				const l = (string: string) => string?.toLowerCase();

				// Поиск по имени и фамилии
				const chatsWithNames = [
					...state.chats.filter(chatData => {
						const isChatNameIncludes = l(chatData?.firstName)?.includes(l(state.chatSearch)) || l(chatData?.secondName)?.includes(l(state.chatSearch)) || l(chatData?.title)?.includes(l(state.chatSearch));
						if (isChatNameIncludes) {
							return true;
						}
					}),
				];

				// Поиск по сообщениям
				const chatsWithMessages = [];

				return [...chatsWithNames, ...chatsWithMessages];
			} catch (e) {
				console.log(e);
				return [];
			}
		},
	},

	actions: {
		raiseChat(chatId: string | number) {
			const chatIndex = this.getChatIndex(chatId);
			const chat = this.getChat(chatId);
			if (!chat.isPinned) {
				this.chats.splice(chatIndex, 1);
				this.chats.unshift(chat);
			}
		},

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

		async filterChats(chatSearch: string) {},

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
				id: new Date().getTime(),
				userId,
				type: "text",
				firstName: userData!.firstName ?? "",
				secondName: userData!.secondName ?? "",
				message: message ? message?.replace(/\n/g, "\n") : "",
				date: new Date().toISOString(),
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
				id: new Date().getTime(),
				userId,
				type: "image",
				firstName: userData!.firstName ?? "",
				secondName: userData!.secondName ?? "",
				comment: message ? message?.replace(/\n/g, "\n") : "",
				date: new Date().toISOString(),
				isReceived: true,
				isViewed: false,
				isUnread: false,
				images: [
					...uploadedImages.map(image => {
						return {
							url: image.url,
							fileName: image.fileName,
							date: new Date().toISOString(),
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
				id: new Date().getTime(),
				userId,
				type: "file",
				firstName: userData!.firstName ?? "",
				secondName: userData!.secondName ?? "",
				comment: message ? message?.replace(/\n/g, "\n") : "",
				date: new Date().toISOString(),
				isReceived: true,
				isViewed: false,
				isUnread: false,
				files: [
					...uploadedFiles.map(file => {
						return {
							url: file.url,
							fileName: file.name,
							size: file.size,
							date: new Date().toISOString(),
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
				id: new Date().getTime(),
				userId,
				type: "voice",
				firstName: userData!.firstName ?? "",
				secondName: userData!.secondName ?? "",
				comment: message,
				date: new Date().toISOString(),
				isReceived: true,
				isViewed: false,
				isUnread: false,
				voice: [
					...uploadedVoiceMessages.map(file => {
						return {
							url: file,
							date: new Date().toISOString(),
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
						date: new Date().toISOString(),
					},
				],
			};

			if (this.temporalStorageForAddedUsers.length) {
				newGroupChat.messages.push({
					id: new Date().getTime() as unknown as number,
					type: "message-info",
					message: addedUsersMessage,
					date: new Date().toISOString(),
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
