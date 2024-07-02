<template>
	<FormItem
		class="form-item__select select"
		:required="props.item.required"
	>
		<FormLabel
			v-show="props.item.title != null && props.item.title != ''"
			:title="props.item.title"
		/>

		<SelectField
			:item="props.item"
			:is-read-only="props.isReadOnly"
			:is-multiple="props.isMultiple"
			:is-filtered="props.isFiltered"
			:is-have-null-option="props.isHaveNullOption"
			@click-outside="() => emit('clickOutside', true)"
			@change-value="data => emit('changeValue', data)"
		/>
	</FormItem>
</template>

<script setup>
	import "./Select.scss";

	import SelectField from "./SelectField/SelectField.vue";
	import FormItem from "~/components/ui/AppForm/FormItem/FormItem.vue";
	import FormLabel from "~/components/ui/AppForm/FormLabel/FormLabel.vue";

	const props = defineProps({
		item: {
			default: {
				id: 0,
				required: false,
				title: "Select title",
				value: null,
				focus: false,
				key: null,
				options: [],
				lockedOptions: [],
			},
			type: () => Object,
		},
		isReadOnly: {
			default: false,
			type: Boolean,
		},
		isMultiple: {
			default: false,
			type: Boolean,
		},
		isHaveNullOption: {
			default: true,
			type: Boolean,
		},
		isFiltered: {
			default: false,
			type: Boolean,
		},
	});

	const emit = defineEmits(["changeValue", "clickOutside"]);
</script>
