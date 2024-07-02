import { defineStore } from "pinia";

export const useAudioStore = defineStore("auth", {
	state: () => {
		return {
			audiosPauses: [],
		};
	},

	getters: {},

	actions: {
		pauseAudios() {
			this.audiosPauses.forEach(pauseAudio => pauseAudio());
		},
	},
});
