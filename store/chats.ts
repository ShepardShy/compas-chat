import { defineStore } from 'pinia'
import type { MessagesTypesType, GroupChatType, UserChatType } from '~/types/messages'
import { formattedDateToday } from '~/composables/chats'

export const useChatsStore = defineStore('chats', {
  state: () => {
    return {
      userId: 1,
      chats: [
        {
          id: 1,
          userId: 1,
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: true,
          isActive: true,
          isTyping: false,
          photo: '/photo.png',
          isMutedOff: false,
          position: 'Менеджер по работе с клиентами',
          isGroupChat: false,
          totalTextMessages: 200,
          totalPhotoMessages: 404,
          totalVideoMessages: 23,
          totalFileMessages: 19,
          totalVoiceMessages: 5,
          totalLinksMessages: 66,
          isMenuOpen: false,
          isDetailedInfoOpen: false,
          lastTimeActive: '15.02.2024 15:00',
          messages: [
            {
              id: 1,
              message: 'Привет Привет ПриветПриветПривет ПриветПривет ПриветПриветПривет Привет Привет ПриветПривет Привет',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: false,
              date: '14.02.2024 15:12'
            },
            {
              id: 2,
              message: 'Принимаете заказ?',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: false,
              date: '14.02.2024 15:12'
            },
            {
              id: 1,
              message: 'Привет',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: false,
              date: '14.02.2024 15:12'
            },
            {
              id: 2,
              message: 'Принимаете заказ?',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: false,
              date: '14.02.2024 15:12'
            },
            {
              id: 1,
              message: 'Привет',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: false,
              date: '16.02.2024 15:12'
            },
            {
              id: 2,
              message: 'Принимаете заказ?',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: false,
              date: '16.02.2024 15:12'
            },
            {
              id: 3,
              message: 'Привет',
              userId: 2,
              isReceived: true,
              isViewed: true,
              isUnread: false,
              date: '16.02.2024 15:12'
            },
            {
              id: 4,
              message: 'Принимаете заказ?',
              userId: 2,
              isReceived: true,
              isViewed: true,
              isUnread: false,
              date: '16.02.2024 15:12'
            },
            {
              id: 5,
              message: 'Привет',
              userId: 1,
              isReceived: true,
              isViewed: false,
              isUnread: false,
              date: '29.02.2024 15:12'
            },
            {
              id: 6,
              message: 'Принимаете заказ?',
              userId: 1,
              isReceived: false,
              isViewed: false,
              isUnread: false,
              date: '05.03.2024 15:12'
            }
          ]
        },
        {
          id: 11,
          isGroupChat: true,
          title: 'Логистика',
          photo: '',
          isPinned: true,
          isTyping: false,
          isMutedOff: false,
          totalTextMessages: 200,
          totalPhotoMessages: 404,
          totalVideoMessages: 23,
          totalFileMessages: 19,
          totalVoiceMessages: 5,
          totalLinksMessages: 66,
          isMenuOpen: false,
          isDetailedInfoOpen: false,
          users: [
            {
              id: 2,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами',
              lastTimeActive: '15.02.2024 15:00'
            },
            {
              id: 3,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер',
              lastTimeActive: '20.02.2024 14:00'
            },
            {
              id: 4,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами',
              lastTimeActive: '20.02.2024 14:00'
            },
            {
              id: 1,
              firstName: 'Тимур',
              secondName: 'Киселев',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер',
              lastTimeActive: '20.02.2024 14:00'
            },
            {
              id: 22,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами',
              lastTimeActive: '20.02.2024 14:00'
            },
            {
              id: 29,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер',
              lastTimeActive: '20.02.2024 14:00'
            },
            {
              id: 8,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами',
              lastTimeActive: '20.02.2024 14:00'
            },
            {
              id: 9,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер',
              lastTimeActive: '25.02.2024 15:00'
            },
            {
              id: 55,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами',
              lastTimeActive: '20.02.2024 14:00'
            },
            {
              id: 77,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер',
              lastTimeActive: '29.02.2024 18:00'
            },
            {
              id: 12,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами',
              lastTimeActive: '20.02.2024 14:00'
            },
            {
              id: 13,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер',
              lastTimeActive: '15.02.2024 15:00'
            },
            {
              id: 14,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами',
              lastTimeActive: '20.02.2024 14:00'
            },
            {
              id: 15,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер',
              lastTimeActive: '20.02.2024 14:00'
            },
            {
              id: 13,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер',
              lastTimeActive: '20.02.2024 14:00'
            },
            {
              id: 14,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами',
              lastTimeActive: '15.02.2024 15:00'
            },
            {
              id: 15,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '',
              position: 'Менеджер',
              lastTimeActive: '20.02.2024 14:00'
            }
          ],
          messages: [
            {
              id: 33,
              type: 'message-info',
              message: 'Тимур Киселев создал(а) чат',
              date: '14.02.2024 15:12'
            },
            {
              id: 1,
              userId: 1,
              firstName: 'Тимур',
              secondName: 'Киселев',
              message: 'Добрый день, коллеги',
              date: '14.02.2024 15:12'
            },
            {
              id: 2,
              userId: 2,
              firstName: 'Илья',
              secondName: 'Петров',
              message: 'Добрый день',
              date: '08.03.2024 15:12'
            }
          ]
        },
        {
          id: 2,
          userId: 2,
          firstName: 'Илья',
          secondName: 'Петров',
          isPinned: true,
          isActive: true,
          isTyping: false,
          photo: undefined,
          isMutedOff: true,
          position: 'Менеджер по работе с клиентами',
          isGroupChat: false,
          totalTextMessages: 200,
          totalPhotoMessages: 404,
          totalVideoMessages: 23,
          totalFileMessages: 19,
          totalVoiceMessages: 5,
          totalLinksMessages: 66,
          isMenuOpen: false,
          isDetailedInfoOpen: false,
          lastTimeActive: '15.02.2024 15:00',
          messages: [
            {
              id: 1,
              message: 'Привет',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: true,
              date: '14.02.2024 15:12'
            },
            {
              id: 2,
              message: 'Принимаете заказ?',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: true,
              date: '14.02.2024 15:12'
            }
          ]
        },
        {
          id: 3,
          userId: 3,
          firstName: 'Вася',
          secondName: 'Петров',
          isPinned: false,
          isActive: true,
          isTyping: false,
          photo: undefined,
          isMutedOff: false,
          position: 'Менеджер по работе с клиентами',
          isGroupChat: false,
          totalTextMessages: 200,
          totalPhotoMessages: 404,
          totalVideoMessages: 23,
          totalFileMessages: 19,
          totalVoiceMessages: 5,
          totalLinksMessages: 66,
          isMenuOpen: false,
          isDetailedInfoOpen: false,
          lastTimeActive: '15.02.2024 15:00',
          messages: [
            {
              id: 1,
              message: 'Привет',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: false,
              date: '14.02.2024 15:12'
            },
            {
              id: 2,
              message: 'Принимаете заказ?',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: false,
              date: '14.02.2024 15:12'
            }
          ]
        },
        {
          id: 4,
          userId: 4,
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: false,
          isActive: false,
          isTyping: false,
          photo: undefined,
          isMutedOff: false,
          position: '',
          isGroupChat: false,
          totalTextMessages: 200,
          totalPhotoMessages: 404,
          totalVideoMessages: 23,
          totalFileMessages: 19,
          totalVoiceMessages: 5,
          totalLinksMessages: 66,
          isMenuOpen: false,
          isDetailedInfoOpen: false,
          lastTimeActive: '15.02.2024 15:00',
          messages: [
            {
              id: 1,
              message: 'Привет',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: false,
              date: '14.02.2024 15:12'
            },
            {
              id: 2,
              message: 'Принимаете заказ?',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: false,
              date: '14.02.2024 15:12'
            }
          ]
        },
        {
          id: 6,
          userId: 6,
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: false,
          isActive: false,
          isTyping: false,
          photo: '/photo.png',
          isMutedOff: false,
          position: '',
          isGroupChat: false,
          totalTextMessages: 200,
          totalPhotoMessages: 404,
          totalVideoMessages: 23,
          totalFileMessages: 19,
          totalVoiceMessages: 5,
          totalLinksMessages: 66,
          isMenuOpen: false,
          isDetailedInfoOpen: false,
          lastTimeActive: '15.02.2024 15:00',
          messages: [
            {
              id: 1,
              message: 'Привет',
              userId: 6,
              isReceived: true,
              isViewed: true,
              isUnread: true,
              date: '13.02.2024 15:12'
            },
            {
              id: 2,
              message: 'Принимаете заказ?',
              userId: 6,
              isReceived: true,
              isViewed: true,
              isUnread: true,
              date: '13.02.2024 15:12'
            }
          ]
        },
        {
          id: 7,
          userId: 7,
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: false,
          isActive: true,
          isTyping: true,
          photo: '/photo.png',
          isMutedOff: true,
          position: 'Менеджер по работе с клиентами',
          isGroupChat: false,
          totalTextMessages: 200,
          totalPhotoMessages: 404,
          totalVideoMessages: 23,
          totalFileMessages: 19,
          totalVoiceMessages: 5,
          totalLinksMessages: 66,
          isMenuOpen: false,
          isDetailedInfoOpen: false,
          lastTimeActive: '15.02.2024 15:00',
          messages: []
        },
        {
          id: 12,
          isGroupChat: true,
          title: 'Праздники 🤩',
          photo: '',
          isPinned: false,
          isTyping: false,
          isMutedOff: false,
          totalTextMessages: 200,
          totalPhotoMessages: 404,
          totalVideoMessages: 23,
          totalFileMessages: 19,
          totalVoiceMessages: 5,
          totalLinksMessages: 66,
          isMenuOpen: false,
          isDetailedInfoOpen: false,
          lastTimeActive: '15.02.2024 15:00',
          users: [
            {
              id: 2,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами'
            },
            {
              id: 3,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер'
            }
          ],
          messages: [
            {
              id: 1,
              userId: 1,
              firstName: 'Тимур',
              secondName: 'Киселев',
              message: 'Сдаем на праздник',
              date: '14.02.2024 15:12'
            },
            {
              id: 2,
              userId: 2,
              firstName: 'Илья',
              secondName: 'Петров',
              message: 'Несу',
              date: '14.02.2024 15:12'
            }
          ]
        },
        {
          id: 8,
          userId: 8,
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: false,
          isActive: true,
          isTyping: false,
          photo: undefined,
          isMutedOff: false,
          position: 'Менеджер',
          isGroupChat: false,
          totalTextMessages: 200,
          totalPhotoMessages: 404,
          totalVideoMessages: 23,
          totalFileMessages: 19,
          totalVoiceMessages: 5,
          totalLinksMessages: 66,
          isMenuOpen: false,
          isDetailedInfoOpen: false,
          lastTimeActive: '15.02.2024 15:00',
          messages: []
        },
        {
          id: 9,
          userId: 9,
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: false,
          isActive: true,
          isTyping: false,
          photo: undefined,
          isMutedOff: false,
          position: 'Менеджер',
          isGroupChat: false,
          totalTextMessages: 200,
          totalPhotoMessages: 404,
          totalVideoMessages: 23,
          totalFileMessages: 19,
          totalVoiceMessages: 5,
          totalLinksMessages: 66,
          isMenuOpen: false,
          isDetailedInfoOpen: false,
          lastTimeActive: '15.02.2024 15:00',
          messages: [
            {
              id: 1,
              message: 'Привет',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: true,
              date: '14.02.2024 15:12'
            },
            {
              id: 2,
              message: 'Принимаете заказ?',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: true,
              date: '14.02.2024 15:12'
            }
          ]
        },
        {
          id: 10,
          userId: 10,
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: false,
          isActive: true,
          isTyping: false,
          photo: undefined,
          isMutedOff: false,
          position: 'Менеджер',
          isGroupChat: false,
          totalTextMessages: 200,
          totalPhotoMessages: 404,
          totalVideoMessages: 23,
          totalFileMessages: 19,
          totalVoiceMessages: 5,
          totalLinksMessages: 66,
          isMenuOpen: false,
          isDetailedInfoOpen: false,
          lastTimeActive: '15.02.2024 15:00',
          messages: [
            {
              id: 1,
              message: 'Привет',
              userId: 1,
              isReceived: true,
              isViewed: true,
              isUnread: false,
              date: '14.02.2024 15:12'
            },
            {
              id: 2,
              message: 'Принимаете заказ?',
              userId: 1,
              isReceived: false,
              isViewed: false,
              isUnread: true,
              date: '14.02.2024 15:12'
            }
          ]
        }
      ] as Array<UserChatType | GroupChatType >,
      filteredChats: [] as Array<UserChatType | GroupChatType> | [],
      openedChatId: 11 as undefined | number,

      chatIdForOpenModal: undefined as undefined | number,
      isDetailedInfoModalOpen: false,
      isAddUserModalOpen: false,
      isGroupChatEditModalOpen: false,
      isGroupChatCreateModalOpen: false,

      openMessageTypeModal: undefined as undefined | MessagesTypesType,
      isOpenMessageTypeModal: false,
      dataFromSelectedTypeOfChatMessage: [] as unknown,

      temporalStorageForGroupChat: {
        title: '',
        photo: '',
        users: []
      },

      temporalStorageForDeletedUsers: [],
      temporalStorageForAddedUsers: [],

      testTextMessages: [
        {
          id: 1,
          message: 'Привет Привет ПриветПриветПривет ПриветПривет ПриветПриветПривет Привет Привет ПриветПривет Привет',
          userId: 1,
          isReceived: true,
          isViewed: true,
          isUnread: false,
          date: '13.02.2024 15:12'
        },
        {
          id: 2,
          message: 'Принимаете заказ?',
          userId: 1,
          isReceived: true,
          isViewed: true,
          isUnread: false,
          date: '13.02.2024 15:10'
        },
        {
          id: 1,
          message: 'Привет',
          userId: 1,
          isReceived: true,
          isViewed: true,
          isUnread: false,
          date: '14.02.2024 15:12'
        },
        {
          id: 2,
          message: 'Принимаете заказ?',
          userId: 1,
          isReceived: true,
          isViewed: true,
          isUnread: false,
          date: '14.02.2024 15:12'
        },
        {
          id: 1,
          message: 'Привет',
          userId: 1,
          isReceived: true,
          isViewed: true,
          isUnread: false,
          date: '14.02.2024 15:12'
        },
        {
          id: 2,
          message: 'Принимаете заказ?',
          userId: 1,
          isReceived: true,
          isViewed: true,
          isUnread: false,
          date: '14.02.2024 15:12'
        },
        {
          id: 3,
          message: 'Привет',
          userId: 2,
          isReceived: true,
          isViewed: true,
          isUnread: false,
          date: '14.02.2024 15:12'
        },
        {
          id: 4,
          message: 'Принимаете заказ?',
          userId: 2,
          isReceived: true,
          isViewed: true,
          isUnread: false,
          date: '15.02.2024 15:12'
        },
        {
          id: 5,
          message: 'Привет',
          userId: 1,
          isReceived: true,
          isViewed: false,
          isUnread: false,
          date: '18.02.2024 15:12'
        },
        {
          id: 6,
          message: 'Принимаете заказ?',
          userId: 1,
          isReceived: false,
          isViewed: false,
          isUnread: false,
          date: '18.02.2024 15:12'
        }
      ],
      testPhotoMessages: [
        {
          date: '15.01.2024 15:05',
          messages: [
            {
              url: '/image-example.png'
            },
            {
              url: '/image-example.png'
            },
            {
              url: '/image-example.png'
            },
            {
              url: '/image-example.png'
            }
          ]
        },
        {
          date: '20.02.2024 15:05',
          messages: [
            {
              url: '/image-example.png'
            },
            {
              url: '/image-example.png'
            },
            {
              url: '/image-example.png'
            },
            {
              url: '/image-example.png'
            },
            {
              url: '/image-example.png'
            },
            {
              url: '/image-example.png'
            },
            {
              url: '/image-example.png'
            },
            {
              url: '/image-example.png'
            },
            {
              url: '/image-example.png'
            },
            {
              url: '/image-example.png'
            },
            {
              url: '/image-example.png'
            },
            {
              url: '/image-example.png'
            }
          ]
        }
      ]
    }
  },

  getters: {
    chatsWithPinnedUsers: state => state.chats.filter(chat => chat.isPinned),
    chatsWithoutPinned: state => state.chats.filter(chat => !chat.isPinned),
    openedChatData: (state): UserChatType | GroupChatType | undefined => {
      const chatData = state.chats.find(chat => chat.id === state.openedChatId)
      const messages = chatData?.messages
      const preparedMessages:Array<{ date: string, messages: UserChatType | GroupChatType | undefined }> = []

      for (let i = 0; i < messages.length; i++) {
        if (i === 0) {
          preparedMessages.push({
            date: messages[i]?.date?.slice(0, 10),
            messages: [messages[i]]
          })
        } else if (messages[i]?.date.slice(0, 10) === preparedMessages[preparedMessages.length - 1].date) {
          preparedMessages[preparedMessages.length - 1].messages.push(messages[i])
        } else {
          preparedMessages.push({
            date: messages[i]?.date.slice(0, 10),
            messages: [messages[i]]
          })
        }
      }

      return {
        ...chatData,
        messages: preparedMessages
      }
    },
    openModalChatData: (state): UserChatType | GroupChatType | undefined => state.chats.find(chat => chat.id === state.chatIdForOpenModal),
    allChatUsers: state => state.chats.filter(chat => !chat.isGroupChat)
  },

  actions: {
    async togglePinUser (chatId: string | number) {
      try {
        this.chats = this.chats.map((chatData) => {
          if (chatData.id == chatId) {
            return {
              ...chatData,
              isPinned: !chatData.isPinned
            }
          } else {
            return chatData
          }
        })
      } catch (e) {
        console.log(e)
      }
    },

    async toggleUserMuted (chatId: string | number) {
      try {
        this.chats = this.chats.map((chatData) => {
          if (chatData.id == chatId) {
            return {
              ...chatData,
              isMutedOff: !chatData.isMutedOff
            }
          } else {
            return chatData
          }
        })
      } catch (e) {
        console.log(e)
      }
    },

    async filterChats (chatName: string) {
      try {
        console.log(chatName)
      } catch (e) {
        console.log(e)
      }
    },

    async deleteChat (chatId: string | number) {
      try {
        this.chats = this.chats.filter(chat => chat.id !== chatId)
        this.openedChatId = this.chats[0].id ?? undefined
      } catch (e) {
        console.log(e)
      }
    },

    async addToGroup (userId: number, groupId: number) {
      const userData = this.chats
        .find(chat => chat.id === userId && !chat.isGroupChat)

      this.chats = this.chats.map((chat) => {
        if (!chat.isGroupChat) {
          return chat
        }

        if (chat.id === groupId) {
          return {
            ...chat,
            users: [
              userData,
              ...(chat as GroupChatType).users
            ]
          }
        } else {
          return chat
        }
      })
    },

    async removeFromGroup (userId: number, groupId: number) {
      this.chats = this.chats.map((chat) => {
        if (!chat.isGroupChat) {
          return chat
        }

        if (chat.id === groupId) {
          return {
            ...chat,
            users: (chat as GroupChatType).users.filter(user => userId !== user.id)
          }
        } else {
          return chat
        }
      })
    },

    clearChatIdForOpenModal () {
      this.chatIdForOpenModal = undefined
    },

    closeDetailedModal () {
      this.isDetailedInfoModalOpen = false
    },

    closeAddUserModal () {
      this.isAddUserModalOpen = false
    },

    closeGroupChatEditModal () {
      this.isGroupChatEditModalOpen = false
    },

    closeMessageTypeModal () {
      this.isOpenMessageTypeModal = false
    },

    updateGroupChat (newChatData: GroupChatType) {
      this.chats = this.chats.map((chat) => {
        if (!chat.isGroupChat) {
          return chat
        }

        if (chat.id === newChatData.id) {
          return newChatData
        } else {
          return chat
        }
      })
    },

    clearDataFromSelectedTypeOfChatMessage () {
      this.dataFromSelectedTypeOfChatMessage = []
    },

    getTextMessages () {
      this.dataFromSelectedTypeOfChatMessage = [...this.testTextMessages]
    },

    getPhotoMessages () {
      this.dataFromSelectedTypeOfChatMessage = [...this.testPhotoMessages]
    },

    closeGroupChatCreateModal () {
      this.isGroupChatCreateModalOpen = false
    },

    clearTemporalStorageForNewGroupChat () {
      this.temporalStorageForGroupChat = {
        title: '',
        photo: '',
        users: []
      }
    },

    updateTemporalStorageForGroupChat (
      temporalChatData: {
                    title: string
                    photo: string
                    users: never[];
                }) {
      this.temporalStorageForGroupChat = temporalChatData
    },

    createGroupChat () {
      const currentUser: UserChatType = this.chats.find(chat => chat.id === this.userId && !chat.isGroupChat)
      const fullUserName = currentUser.firstName
        ? currentUser.firstName + ' ' + currentUser.secondName
        : currentUser.secondName

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
        messages: [{
          id: 33,
          type: 'message-info',
          message: `${fullUserName} создал(а) чат`,
          date: formattedDateToday()
        }]
      }

      this.chats = [newGroupChat, ...this.chats]
      this.openedChatId = newGroupChat.id

      this.clearTemporalStorageForNewGroupChat()
      this.closeGroupChatCreateModal()
    }
  }
}
)
