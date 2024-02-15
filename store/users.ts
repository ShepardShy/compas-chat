import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => {
    return {
      users: [
        {
          id: 1,
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: true,
          isActive: true,
          isTyping: false,
          photo: '/photo.png',
          isMutedOff: false,
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
          id: 2,
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: true,
          isActive: true,
          isTyping: false,
          photo: undefined,
          isMutedOff: true,
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
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: false,
          isActive: true,
          isTyping: false,
          photo: undefined,
          isMutedOff: false,
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
          isActive: true,
          isTyping: false,
          photo: undefined,
          isMutedOff: false,
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
          id: 5,
          firstName: 'Тимур',
          secondName: 'Киселев',
          isPinned: false,
          isActive: true,
          isTyping: false,
          photo: undefined,
          isMutedOff: false,
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
        }
      ],
      openedChatId: 4 as undefined | number
    }
  },

  getters: {
    pinnedUsers: state => state.users.filter(user => user.isPinned),
    usersWithoutPinned: state => state.users.filter(user => !user.isPinned)
  },

  actions: {
    async unpinUser (userId: string | number) {
      try {
        this.users = this.users.map((userData) => {
          if (userData.id == userId) {
            return {
              ...userData,
              isPinned: false
            }
          } else {
            return userData
          }
        })
      } catch (e) {
        console.log(e)
      }
    },

    async toggleUserMuted (userId: string | number) {
      try {
        this.users = this.users.map((userData) => {
          if (userData.id == userId) {
            return {
              ...userData,
              isMutedOff: !userData.isMutedOff
            }
          } else {
            return userData
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
  }
})
