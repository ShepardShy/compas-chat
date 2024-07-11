import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
	state: () => {
		return {
			isMobileSize: undefined as undefined | boolean,
			isChatsShown: true,
			isLoading: true,
			chatIdForOpenModal: 0 as undefined | number,
		};
	},

	getters: {},

	actions: {
		setIsMobileSize(isMobileSize: boolean) {
			this.isMobileSize = isMobileSize;
		},
	},
});
