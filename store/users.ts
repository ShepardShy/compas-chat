import { defineStore } from 'pinia'
import type { GroupChatType, UserChatType } from '~/types/messages'

export const useUsersStore = defineStore('users', {
  state: () => {
    return {
      userId: 1,
      chats: [
        {
          id: 1,
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: true,
          isActive: true,
          isTyping: false,
          photo: '/photo.png',
          isMutedOff: false,
          position: 'Менеджер по работе с клиентами',
          isGroupChat: false,
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
          id: 11,
          isGroupChat: true,
          title: 'Логистика',
          img: '',
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
          firstName: 'Илья',
          secondName: 'Петров',
          isPinned: true,
          isActive: true,
          isTyping: false,
          photo: undefined,
          isMutedOff: true,
          position: 'Менеджер по работе с клиентами',
          isGroupChat: false,
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
          firstName: 'Вася',
          secondName: 'Петров',
          isPinned: false,
          isActive: true,
          isTyping: false,
          photo: undefined,
          isMutedOff: false,
          position: 'Менеджер по работе с клиентами',
          isGroupChat: false,
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
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: false,
          isActive: false,
          isTyping: false,
          photo: undefined,
          isMutedOff: false,
          position: '',
          isGroupChat: false,
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
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: false,
          isActive: false,
          isTyping: false,
          photo: '/photo.png',
          isMutedOff: false,
          position: '',
          isGroupChat: false,
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
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: false,
          isActive: true,
          isTyping: true,
          photo: '/photo.png',
          isMutedOff: true,
          position: 'Менеджер по работе с клиентами',
          isGroupChat: false,
          messages: []
        },
        ,
        {
          id: 12,
          isGroupChat: true,
          title: 'Праздники 🤩',
          img: '',
          isPinned: false,
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
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: false,
          isActive: true,
          isTyping: false,
          photo: undefined,
          isMutedOff: false,
          position: 'Менеджер',
          isGroupChat: false,
          messages: []
        },
        {
          id: 9,
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: false,
          isActive: true,
          isTyping: false,
          photo: undefined,
          isMutedOff: false,
          position: 'Менеджер',
          isGroupChat: false,
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
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: false,
          isActive: true,
          isTyping: false,
          photo: undefined,
          isMutedOff: false,
          position: 'Менеджер',
          isGroupChat: false,
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
      ] as Array< UserChatType | GroupChatType>,
      openedChatId: 4 as undefined | number
    }
  },

  getters: {
    chatsWithPinnedUsers: state => state.chats.filter(chat => chat.isPinned),
    chatsWithoutPinned: state => state.chats.filter(chat => !chat.isPinned),
    openedChatData: state => state.chats.find(chat => chat.id === state.openedChatId)
  },

  actions: {
    async unpinUser (userId: string | number) {
      try {
        this.chats = this.chats.map((chatData) => {
          if (chatData.id == userId) {
            return {
              ...chatData,
              isPinned: false
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
    }
  }
})
