<template>
	<FormItem
		class="form-item__checkbox"
		:class="props.disabled ? 'form-item__checkbox_disabled' : ''"
		@click="event => changeValue(event)"
	>
		<CheckboxLabel
			:title="props.item.title"
			:is-h-t-m-l="props.item.isHTML"
		/>
		<CheckboxField
			:item="{
				id: props.item.id,
				value: props.item.value,
			}"
			:disabled="props.disabled"
		/>
	</FormItem>
</template>

<script setup>
	import "./Checkbox.scss";

	import CheckboxLabel from "./CheckboxLabel/CheckboxLabel.vue";
	import CheckboxField from "./CheckboxField/CheckboxField.vue";
	import FormItem from "~/components/ui/AppForm/FormItem/FormItem.vue";

	const props = defineProps({
		item: {
			default: {
				id: 0,
				key: "",
				title: "",
				value: false,
			},
			type: Object,
		},
		disabled: {
			default: false,
			type: Boolean,
		},
	});

	const emit = defineEmits(["changeValue"]);

	const changeValue = event => {
		if (!props.disabled) {
			emit(
				"changeValue",
				{
					id: props.item.id,
					key: props.item.key,
					value: !props.item.value,
				},
				event
			);
		}
	};
</script>
