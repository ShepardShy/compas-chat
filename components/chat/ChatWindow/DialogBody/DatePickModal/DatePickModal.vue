<script setup lang="ts">
	import { useChatsStore } from "~/store/chats";
	import { useSettingsStore } from "~/store/settings";

	import BackIcon from "~/assets/icons/back-icon.svg";
	import CloseIcon from "~/assets/icons/close-icon.svg";

	import AppH3 from "~/components/ui/AppH3/AppH3.vue";

	const chatsStore = useChatsStore();
	const { userId, openMessageTypeModal, dataFromSelectedTypeOfChatMessage } = storeToRefs(chatsStore);

	const settingStore = useSettingsStore();
	const { isMobileSize } = storeToRefs(settingStore);

	const searchInputValue = ref();

	const page = ref(1);

	const closeDatePickModal = () => {
		// chatsStore.clearDataFromSelectedTypeOfChatMessage();
		// chatsStore.closeMessageTypeModal();
		chatsStore.closeDatePickModal();
	};

	const datePickYear = {
		id: 0,
		key: "",
		value: "",
		type: "text",
		focus: false,
		placeholder: "",
		substring: null,
		title: "Год",
	};
	const datePickMonth = {
		id: 0,
		key: "",
		value: "",
		type: "text",
		focus: false,
		placeholder: "",
		substring: null,
		title: "Месяц",
	};
	const datePickDay = {
		id: 0,
		key: "",
		value: "",
		type: "text",
		focus: false,
		placeholder: "",
		substring: null,
		title: "День",
	};

	// Настройки календарей
	const datePickYearSettings = {
		"year-picker": true,
	};
	const datePickMonthSettings = {
		"month-picker": true,
		"disable-month-year-select": true,
	};
	const datePickDaySettings = {
		inline: true,
		"disable-month-year-select": true,
	};

	onMounted(() => {
		// messageType.value = messagesTypesList.find(type => type.action === openMessageTypeModal.value)?.title;
	});
</script>

<template>
	<div
		class="date-pick"
		:class="{
			'date-pick_mobile': isMobileSize,
		}"
	>
		<div
			class="date-pick__modal"
			:class="{
				'date-pick__modal_mobile': isMobileSize,
			}"
			@click.stop
		>
			<div class="date-pick__top">
				<AppH3 class="date-pick__title">Дата</AppH3>
				<CloseIcon
					class="date-pick__close-icon"
					@click="closeDatePickModal"
				/>
			</div>

			<UiAppInputsDate
				class="date-pick__input"
				:isShowRightSidebar="false"
				:item="datePickYear"
				:isYear="true"
				:calendarSettings="datePickYearSettings"
			/>
			<UiAppInputsDate
				class="date-pick__input date-pick__month"
				:isShowRightSidebar="false"
				:item="datePickMonth"
				:isMonth="true"
				:calendarSettings="datePickMonthSettings"
				@changeValue="data => console.log(data)"
			/>
			<UiAppInputsDate
				class="date-pick__picker"
				:isShowRightSidebar="false"
				:item="datePickDay"
				:isDay="true"
				:calendarSettings="datePickDaySettings"
			/>
		</div>

		<div
			v-if="!isMobileSize"
			class="date-pick__bg-padding"
		/>
	</div>
</template>

<style lang="scss">
	@import url(./DatePickModal.scss);
</style>
