import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      isMobileSize: false,
      isChatsShown: false
    }
  },

  getters: {},

  actions: {

  }
})
