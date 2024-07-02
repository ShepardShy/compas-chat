<template>
	<FormItem
		class="address form-item__address"
		:required="props.item.required"
	>
		<FormLabel
			v-show="props.item.title != null && props.item.title != ''"
			:title="props.item.title"
		/>

		<Field
			:item="props.item"
			:is-read-only="props.isReadOnly"
			:is-show-map="props.isShowMap"
			:is-select-several="props.isSelectSeveral"
			@change-value="data => emit('changeValue', data)"
			@search-options="data => emit('searchOptions', data)"
			@select-points="data => emit('selectPoints', data)"
		/>
	</FormItem>
</template>

<script setup>
	import "./Address.scss";

	import FormLabel from "~/components/ui/AppForm/FormLabel/FormLabel.vue";
	import FormItem from "~/components/ui/AppForm/FormItem/FormItem.vue";
	import Field from "~/components/ui/AppInputs/Address/Field/Field.vue";

	const props = defineProps({
		item: {
			default: {
				id: 0,
				title: "Адрес",
				key: "address",
				required: false,
				value: {
					text: "",
					coords: ["55.642606", "37.547414"],
				},
			},
			type: Object,
		},
		isReadOnly: {
			default: false,
			type: Boolean,
		},
		isShowMap: {
			default: false,
			type: Boolean,
		},
		isSelectSeveral: {
			default: false,
			type: Boolean,
		},
	});

	const emit = defineEmits(["changeValue", "searchOptions", "selectPoints"]);
</script>
