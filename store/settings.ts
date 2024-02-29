import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      isMobileSize: undefined as undefined | boolean,
      isChatsShown: false,
      isLoading: true
    }
  },

  getters: {},

  actions: {
    setIsMobileSize (isMobileSize: boolean) {
      this.isMobileSize = isMobileSize
    }
  }
})
