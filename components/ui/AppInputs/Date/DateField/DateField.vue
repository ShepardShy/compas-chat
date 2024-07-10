<template>
	<VueDatePicker
		v-bind="props.settings"
		ref="datepicker"
		v-model="localDate"
		:class="{ datepicker_multiple: props.isMultiple, 'hide-selected-date': !isShowSelectedDate }"
		auto-apply
		:multi-calendars="props.isMultiple"
		:range="props.isMultiple"
		locale="ru"
		month-name-format="long"
		position="left"
		hide-offset-dates
		:format-locale="ru"
		:format="props.isMonth ? 'MMMM' : props.isYear ? 'yyyy' : 'dd.MM.yyyy'"
		placeholder="__.__.____"
		:enable-time-picker="false"
		:max-time="{ hours: 0, minutes: 0, seconds: 0 }"
		:month-change-on-scroll="false"
		:style="!props.isShowRightSidebar ? 'display: block;' : ''"
		@update:model-value="value => changeValue(value)"
		@open="() => $emit('openDatepicker', true)"
	>
		<template
			v-if="props.isShowRightSidebar"
			#right-sidebar
		>
			<div class="datapicker__preset-days">
				<div
					v-for="day in presetDates[props.isMultiple ? 'plural' : 'default']"
					class="datapicker__preset-item"
					@click="changeValue(day.day)"
				>
					{{ day.title }}
				</div>
			</div>
		</template>
		<template
			v-if="props.isMultiple"
			#left-sidebar
		>
			<div class="datapicker__footer">
				<div class="datepicker__inputs">
					<AppInput
						:item="{
							id: 0,
							required: false,
							substring: null,
							type: 'text',
							title: null,
							placeholder: '__.__.____',
							value: rangeStart,
							key: 'rangeStart',
							focus: false,
						}"
						:mask="'##.##.####'"
						@change-value="data => callRangeAction({ action: 'setInputValue', value: data })"
						@blur="event => callRangeAction({ action: 'setDay', value: { key: 'rangeStart', value: event.target.value } })"
					/>

					—

					<AppInput
						:item="{
							id: 1,
							required: false,
							substring: null,
							type: 'text',
							title: null,
							placeholder: '__.__.____',
							value: rangeEnd,
							key: 'rangeEnd',
							focus: false,
						}"
						:mask="'##.##.####'"
						@change-value="data => callRangeAction({ action: 'setInputValue', value: data })"
						@blur="event => callRangeAction({ action: 'setDay', value: { key: 'rangeEnd', value: event.target.value } })"
					/>
				</div>

				<AppButton
					class="button_blue"
					@click="() => changeValue(null)"
				>
					Применить
				</AppButton>
			</div>
		</template>
	</VueDatePicker>
</template>

<script setup>
	import monthNames from "./composables/monthNames.json";
	import "./DateField.scss";
	import { ru } from "date-fns/locale";

	import { ref, onMounted, watch } from "vue";

	import VueDatePicker from "@vuepic/vue-datepicker";
	import AppButton from "~/components/ui/AppButton/AppButton.vue";
	import AppInput from "~/components/ui/AppInputs/Input/Input.vue";
	import moment from "moment";

	import "@vuepic/vue-datepicker/dist/main.css";

	const datepicker = ref(null);

	const props = defineProps({
		item: {
			default: {
				id: 0,
				key: "",
				value: "",
				type: "text",
				focus: false,
				placeholder: "",
				substring: null,
				title: "Undefined title",
			},
			type: Object,
		},
		disabled: {
			default: false,
			type: Boolean,
		},
		isMultiple: {
			default: false,
			type: Boolean,
		},
		settings: {
			default: {},
			type: Object,
		},
		isDay: {
			default: false,
			type: Boolean,
		},
		isMonth: {
			default: false,
			type: Boolean,
		},
		isYear: {
			default: false,
			type: Boolean,
		},
		isShowRightSidebar: {
			default: true,
			type: Boolean,
		},
		isShowOnPropsChange: {
			default: false,
			type: Boolean,
		},
	});

	const emit = defineEmits(["changeValue", "openDatepicker"]);

	const { item, settings } = toRefs(props);
	const rangeStart = settings.value?.["min-date"];
	const rangeEnd = settings.value?.["max-date"];
	const isShowSelectedDate = ref(true);
	const localDate = ref(null);
	const selectedDate = JSON.parse(JSON.stringify(item.value));

	const presetDates = {
		plural: [
			{
				id: 0,
				title: "Сегодня",
				day: [new Date(), new Date()],
			},
			{
				id: 1,
				title: "Завтра",
				day: [new Date().setDate(new Date().getDate() + 1), new Date().setDate(new Date().getDate() + 1)],
			},
			{
				id: 2,
				title: "Текущий месяц",
				day: [new Date().setDate(1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)],
			},
			{
				id: 3,
				title: "Прошлый месяц",
				day: [new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), new Date(new Date().getFullYear(), new Date().getMonth(), 0)],
			},
			{
				id: 2,
				title: "Текущий год",
				day: [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear() + 1, 0, 0)],
			},
			{
				id: 3,
				title: "Прошлый год",
				day: [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear(), 0, 0)],
			},
		],
		default: [
			{
				id: 0,
				title: "Вчера",
				day: new Date().setDate(new Date().getDate() - 1),
			},
			{
				id: 1,
				title: "Сегодня",
				day: new Date(),
			},
			{
				id: 2,
				title: "Завтра",
				day: new Date().setDate(new Date().getDate() + 1),
			},
			{
				id: 3,
				title: "Послезавтра",
				day: new Date().setDate(new Date().getDate() + 2),
			},
		],
	};

	// Изменение значения в календаре
	const changeValue = value => {
		// Трансформирование значения
		const transformValue = value => {
			return value == null || value == "" ? null : new Date(value).toLocaleDateString("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit" });
		};

		// Изменение в множественном календаре
		const changeMultiple = value => {
			const request = [];

			if (value != null) {
				localDate.value = value;
				rangeStart.value = transformValue(value[0]).split("-").reverse().join(".");
				rangeEnd.value = transformValue(value[1]).split("-").reverse().join(".");
				request[0] = transformValue(localDate.value[0]);
				request[1] = transformValue(localDate.value[1]);
			} else {
				localDate.value = [rangeStart.value, rangeEnd.value];
				request[0] = rangeStart.value.split(".").reverse().join("-");
				request[1] = rangeEnd.value.split(".").reverse().join("-");
			}

			emit("changeValue", { key: props.item.key, value: request });
		};

		// Изменение в обычном календаре
		const changeDefault = value => {
			localDate.value = new Date(value);
			const request = new Date(value).toLocaleDateString("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit" });
			emit("changeValue", { key: props.item.key, value: request }, true);
		};
		// Изменение в календаре по месяцам
		const changeMonth = value => {
			localDate.value.month = value.month;
			const dateWithMonth = new Date().setMonth(value.month);
			// перевод в строку
			const request = new Date(dateWithMonth).toLocaleDateString("default", { month: "long" });
			emit("changeValue", { key: props.item.key, value: value.month, string: request });
		};
		// Изменение в календаре по годам
		const changeYear = value => {
			localDate.value = value;
			emit("changeValue", { key: props.item.key, value });
		};

		if (props.isMultiple) {
			changeMultiple(value);
			return;
		}
		if (props.isMonth) {
			changeMonth(value);
			return;
		}
		if (props.isYear) {
			changeYear(value);
			return;
		}
		changeDefault(value);
	};

	// Установка значения по умолчанию
	const setValue = () => {
		if (props.isYear) {
			localDate.value = props.item.value;
			return;
		}
		if (props.isMultiple) {
			localDate.value = Array.isArray(props.item.value) ? JSON.parse(JSON.stringify(props.item.value)) : [];
			return;
		}
		localDate.value = typeof props.item.value != "string" || [null, undefined].includes(props.item.value) ? null : JSON.parse(JSON.stringify(new Date(props.item.value)));
		localDate.value = typeof props.item.value == "object" ? props.item.value : null;
	};

	// Действия с инпутами в множественном календаре
	const callRangeAction = data => {
		// Установка дня в календаре
		const setDay = data => {
			if (data.key == "rangeStart") {
				localDate.value[0] = data.value.split(".").reverse().join("-");
			} else {
				localDate.value[1] = data.value.split(".").reverse().join("-");
			}
		};

		// Ввод в инпут
		const setInputValue = data => {
			if (data.key == "rangeStart") {
				rangeStart.value = data.value;
			} else {
				rangeEnd.value = data.value;
			}
		};

		switch (data.action) {
			// Установка дня в календаре
			case "setDay":
				setDay(data.value);
				break;

			// Ввод в инпут
			case "setInputValue":
				setInputValue(data.value);
				break;

			default:
				break;
		}
	};

	onMounted(() => {
		setValue();

		// Подписка на пропсы если календарь по месяцам
		if (props.isMonth) {
			watch(
				() => item.value,
				() => {
					if (props.isMonth) {
						if (moment(rangeEnd).set(item.value.value).isAfter(rangeEnd)) {
							item.value.value.month = moment(rangeEnd).month();
						}
						if (moment(rangeStart).set(item.value.value).isBefore(rangeStart)) {
							item.value.value.month = moment(rangeStart).month();
						}
						localDate.value = item.value.value;
						return;
					}
				},
				{ deep: true }
			);
			return;
		}
		// Подписка на пропсы если календарь который не выделяет дату
		if (props.isShowOnPropsChange) {
			watch(
				() => item.value,
				() => {
					// Проверка выводит ли изменение пропса за границы диапазона дат
					if (moment(item.value.value).isAfter(rangeEnd)) {
						item.value.value = moment(item.value.value).set({ month: moment(rangeEnd).month() });
					}
					if (moment(item.value.value).isBefore(rangeStart)) {
						item.value.value = moment(item.value.value).set({ month: moment(rangeStart).month() });
					}
					// Выделять дату только если месяц тот же что при инициализации, иначе скрыть выделение
					const scrollDate = new Date(item.value.value);
					const isScrollDateInRangeOfMonth = moment(scrollDate).isSame(new Date(selectedDate.value), "month");
					if (isScrollDateInRangeOfMonth) {
						datepicker.value.parseModel(selectedDate.value);
						isShowSelectedDate.value = true;
					} else {
						datepicker.value.parseModel(item.value.value);
						isShowSelectedDate.value = false;
					}
				}
			);
			return;
		}
		// Подписка на пропсы
		watch(
			() => item.value,
			() => {
				setValue();
			}
		);
	});
</script>
<style lang="scss">
	.hide-selected-date {
		.dp__active_date {
			border: 1px solid rgba(0, 0, 0, 0) !important;
			background: none !important;
			color: var(--dp-text-color) !important;
			&.dp__cell_disabled {
				color: var(--dp-secondary-color) !important;
			}
		}
	}
</style>
