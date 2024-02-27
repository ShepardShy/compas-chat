import { defineStore } from 'pinia'
import type { GroupChatType, UserChatType } from '~/types/messages'

export const useUsersStore = defineStore('users', {
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
              date: '14.02.2024 15:12'
            },
            {
              id: 5,
              message: 'Привет',
              userId: 1,
              isReceived: true,
              isViewed: false,
              isUnread: false,
              date: '14.02.2024 15:12'
            },
            {
              id: 6,
              message: 'Принимаете заказ?',
              userId: 1,
              isReceived: false,
              isViewed: false,
              isUnread: false,
              date: '14.02.2024 15:12'
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
            },
            {
              id: 4,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами'
            },
            {
              id: 5,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер'
            },
            {
              id: 6,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами'
            },
            {
              id: 7,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер'
            },
            {
              id: 8,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами'
            },
            {
              id: 9,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер'
            },
            {
              id: 10,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами'
            },
            {
              id: 11,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер'
            },
            {
              id: 12,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами'
            },
            {
              id: 13,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер'
            },
            {
              id: 14,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами'
            },
            {
              id: 15,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер'
            },
            {
              id: 13,
              firstName: 'Вася',
              secondName: 'Петров',
              isActive: false,
              isTyping: false,
              photo: '',
              position: 'Менеджер'
            },
            {
              id: 14,
              firstName: 'Илья',
              secondName: 'Петров',
              isActive: true,
              isTyping: false,
              photo: '/photo.png',
              position: 'Менеджер по работе с клиентами'
            },
            {
              id: 15,
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
              message: 'Добрый день, коллеги',
              date: '14.02.2024 15:12'
            },
            {
              id: 2,
              userId: 2,
              firstName: 'Илья',
              secondName: 'Петров',
              message: 'Добрый день',
              date: '14.02.2024 15:12'
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
      ] as Array<UserChatType | GroupChatType>,
      filteredChats: [] as Array<UserChatType | GroupChatType> | [],
      openedChatId: 4 as undefined | number,
      chatIdForOpenModal: 1 as undefined | number
    }
  },

  getters: {
    chatsWithPinnedUsers: state => state.chats.filter(chat => chat.isPinned),
    chatsWithoutPinned: state => state.chats.filter(chat => !chat.isPinned),
    openedChatData: (state): UserChatType | GroupChatType | undefined => state.chats.find(chat => chat.id === state.openedChatId),
    openModalChatData: (state): UserChatType | GroupChatType | undefined => state.chats.find(chat => chat.id === state.chatIdForOpenModal)
  },

  actions: {
    async togglePinUser (userId: string | number) {
      try {
        this.chats = this.chats.map((chatData) => {
          if (chatData.id == userId) {
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

    async toggleUserMuted (userId: string | number) {
      try {
        this.chats = this.chats.map((chatData) => {
          if (chatData.id == userId) {
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

    async deleteChat (userId: string | number) {
      try {
        this.chats = this.chats.filter(chat => chat.id !== userId)
        this.openedChatId = this.chats[0].id ?? undefined
      } catch (e) {
        console.log(e)
      }
    }
  }
}
)
