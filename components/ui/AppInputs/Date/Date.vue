<template>
	<FormItem
		class="form-item__date"
		:required="props.item.required"
		:style="`--substring: ${props.item.substring != undefined ? props.item.substring : ''}`"
	>
		<FormLabel
			v-show="props.item.title != null && props.item.title != ''"
			:title="props.item.title"
		/>

		<FormValue
			v-if="props.isReadOnly"
			:is-h-t-m-l="false"
			:value="setValue"
		/>

		<DateField
			v-else
			:isDay
			:isMonth
			:isYear
			:item="props.item"
			:disabled="props.disabled"
			:is-multiple="props.isMultiple"
			:is-show-right-sidebar="props.isShowRightSidebar"
			:settings="props.calendarSettings"
			@open-datepicker="() => $emit('openDatepicker', true)"
			@change-value="data => $emit('changeValue', data)"
		/>
	</FormItem>
</template>

<script setup>
	import "./Date.scss";

	import { computed } from "vue";

	import DateField from "./DateField/DateField.vue";

	import FormItem from "~/components/ui/AppForm/FormItem/FormItem.vue";
	import FormLabel from "~/components/ui/AppForm/FormLabel/FormLabel.vue";
	import FormValue from "~/components/ui/AppForm/FormValue/FormValue.vue";

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
		isReadOnly: {
			default: false,
			type: Boolean,
		},
		isShowRightSidebar: {
			default: true,
			type: Boolean,
		},
		calendarSettings: {
			type: Object,
			default: {},
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
	});

	const setValue = computed(() => {
		// Трансформирование значения
		const transformValue = value => {
			return [null, undefined].includes(value) || value == "" ? null : new Date(value).toLocaleDateString("ru-RU", { year: "numeric", month: "2-digit", day: "2-digit" });
		};

		if (props.isMultiple) {
			return Array.isArray(props.item.value) ? `${transformValue(props.item.value[0])}-${transformValue(props.item.value[1])}` : null;
		} else {
			return transformValue(props.item.value);
		}
	});
</script>
