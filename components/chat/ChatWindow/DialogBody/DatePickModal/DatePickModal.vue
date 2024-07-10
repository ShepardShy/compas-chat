<script setup lang="ts">
	import { useChatsStore } from "~/store/chats";
	import { useSettingsStore } from "~/store/settings";

	import BackIcon from "~/assets/icons/back-icon.svg";
	import CloseIcon from "~/assets/icons/close-icon.svg";

	import AppH3 from "~/components/ui/AppH3/AppH3.vue";
	import { useDatePickStore } from "~/store/datePick";
	import moment from "moment";

	const chatsStore = useChatsStore();
	const { openedChatData } = storeToRefs(chatsStore);

	const settingStore = useSettingsStore();
	const { isMobileSize } = storeToRefs(settingStore);

	const searchInputValue = ref();

	const page = ref(1);
	const datePickStore = useDatePickStore();
	const { date, selectedDate } = storeToRefs(datePickStore);

	// Получение даты
	date.value = new Date(date.value.split(".").reverse().join("-"));
	const dateMonth = ref({ month: date.value.getMonth(), year: date.value.getFullYear() });
	watch(
		() => date.value,
		() => {
			dateMonth.value = { month: date.value.getMonth(), year: date.value.getFullYear() };
			datePickMonth.value.value = dateMonth.value;
		}
	);

	const dateYear = computed(() => date.value.getFullYear());

	const closeDatePickModal = () => {
		chatsStore.closeDatePickModal();
	};

	// Выбор года
	const datePickYear = ref({
		id: 0,
		key: "",
		value: dateYear,
		type: "text",
		focus: false,
		placeholder: "",
		substring: null,
		title: "Год",
	});
	const pickYearHandler = data => {
		date.value = new Date(date.value.setFullYear(data.value));
		datePickDay.value = {
			...datePickDay.value,
			value: date.value,
		};
		datePickMonth.value.value.year = data.value;
	};

	// Выбор месяца
	const datePickMonth = ref({
		id: 0,
		key: "",
		value: dateMonth.value,
		type: "text",
		focus: false,
		placeholder: "",
		substring: null,
		title: "Месяц",
	});
	const pickMonthHandler = data => {
		date.value = new Date(date.value.setMonth(data.value));
		datePickDay.value = {
			...datePickDay.value,
			value: date.value,
		};
	};

	// Выбор дня
	const datePickDay = ref({
		id: 0,
		key: "",
		value: date.value,
		type: "text",
		focus: false,
		placeholder: "",
		substring: null,
		title: "День",
	});
	const pickDayHandler = data => {
		console.log(data.value);

		selectedDate.value = String(data.value);
		closeDatePickModal();
	};

	// Настройки календарей
	const minDateYear = moment(openedChatData.value.dateRangeStart).startOf("year").toISOString();
	const maxDateYear = moment(openedChatData.value.dateRangeEnd).endOf("year").toISOString();
	const datePickYearSettings = {
		"year-picker": true,
		"min-date": minDateYear,
		"max-date": maxDateYear,
	};
	const minDateMonth = moment(openedChatData.value.dateRangeStart).startOf("month").toISOString();
	const maxDateMonth = moment(openedChatData.value.dateRangeEnd).endOf("month").toISOString();
	const datePickMonthSettings = {
		"month-picker": true,
		"disable-month-year-select": true,
		"min-date": minDateMonth,
		"max-date": maxDateMonth,
	};
	const datePickDaySettings = {
		inline: true,
		"disable-month-year-select": true,
		"min-date": openedChatData.value.dateRangeStart,
		"max-date": openedChatData.value.dateRangeEnd,
	};
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
				@changeValue="pickYearHandler"
			/>
			<UiAppInputsDate
				class="date-pick__input date-pick__month"
				:isShowRightSidebar="false"
				:item="datePickMonth"
				:isMonth="true"
				:calendarSettings="datePickMonthSettings"
				@changeValue="pickMonthHandler"
			/>
			<UiAppInputsDate
				class="date-pick__picker"
				:isShowRightSidebar="false"
				:item="datePickDay"
				:isDay="true"
				@changeValue="pickDayHandler"
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
