<template>
	<FormItem
		class="form-item__group-input group-input"
		:required="props.item.required"
		:style="`--substring: ${props.item.substring != undefined ? props.item.substring : ''}`"
	>
		<FormLabel
			v-show="props.item.title != null && props.item.title != ''"
			:title="props.item.title"
		/>

		<div
			v-if="props.isReadOnly"
			class="group-input__fields"
		>
			<div
				v-for="field of props.item.subfields"
				class="group-input__field"
			>
				<FormLabel
					v-show="field.title != null && field.title != ''"
					:title="field.title"
				/>
				<FormValue :value="field.value" />
			</div>
		</div>

		<div
			v-else
			class="group-input__fields"
		>
			<AppInput
				v-for="field of props.item.subfields"
				class="group-input__field"
				:item="{
					id: field.id,
					required: false,
					substring: null,
					type: 'text',
					title: field.title,
					placeholder: null,
					value: field.value,
					key: field.id,
					focus: false,
				}"
				:disabled="props.disabled"
				@change-value="data => changeValue(data)"
			/>
		</div>
	</FormItem>
</template>

<script setup>
	import "./InputGroup.scss";

	import { ref } from "vue";

	import AppInput from "~/components/ui/AppInputs/Input/Input.vue";
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
				subfields: [
					{
						id: 0,
						title: "Undefined title",
						value: null,
					},
				],
			},
			type: Object,
		},
		disabled: {
			default: false,
			type: Boolean,
		},
		isReadOnly: {
			default: false,
			type: Boolean,
		},
	});

	const emit = defineEmits(["changeValue"]);

	const subfields = ref(props.item.subfields);

	// Изменение значения
	const changeValue = data => {
		const findedField = subfields.value.find(item => item.id == data.key);
		findedField.value = data.value;
		emit("changeValue", subfields.value);
	};
</script>
