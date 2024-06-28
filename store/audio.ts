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
			console.log(this.audiosPauses);

			this.audiosPauses.forEach(pauseAudio => pauseAudio());
		},
	},
});
