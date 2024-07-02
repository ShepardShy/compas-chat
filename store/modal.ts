import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
	state: () => {
		return {
			modals: [],
		};
	},
	getters: {},

	actions: {
		showModal() {
			this.modals.push({
				id: this.modals.length,
				link: `/objects/user/${this.modals.length}`,
				slug: "slug",
				title: `Пользователь`,
				color: "#13A276",
				status: true,
			});
		},
	},
});
