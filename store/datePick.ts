import { defineStore } from "pinia";

export const useDatePickStore = defineStore({
	id: "myDatePickStore",
	state: () => ({
		date: null,
	}),
	actions: {},
});
