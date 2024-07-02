<template>
	<div class="address__wrapper">
		<AppAutocomplete
			:item="props.item"
			:is-can-create="false"
			:is-link="false"
			:is-show-id="false"
			:is-read-only="props.isReadOnly"
			@change-value="data => changeValue(data)"
			@search-options="data => emit('searchOptions', data)"
		/>

		<AppCopy
			v-if="activeOption"
			:text="activeOption.text"
			:button-title="'Скопировать адрес'"
		/>

		<Map
			v-if="props.isShowMap"
			:markers="activeOption ? [activeOption] : []"
			:is-select-several="props.isSelectSeveral"
			:is-read-only="props.isReadOnly"
			@select-points="data => emit('selectPoints', data)"
		/>
	</div>
</template>

<script setup>
	import "./Field.scss";

	import { ref, watch } from "vue";

	import _ from "lodash";
	import AppAutocomplete from "~/components/ui/Appautocomplete/input.vue";
	import Map from "~/components/ui/AppInputs/Address/Map/Map.vue";
	import AppCopy from "~/components/ui/AppCopy/AppCopy.vue";

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

	const activeOption = ref(null);

	const changeValue = data => {
		const selectedItem = props.item.options.find(option => data && _.isEqual(option.value, data.value));
		emit("changeValue", {
			key: props.item.key,
			value: selectedItem ? selectedItem.value : null,
		});
	};

	const setActiveOption = () => {
		if (props.item.value && !props.item.options.find(option => _.isEqual(option.value, props.item.value))) {
			props.item.options.push({
				label: {
					text: props.item.value.text,
				},
				value: props.item.value,
			});
		}

		const selectedItem = props.item.options.find(option => props.item.value && _.isEqual(option.value, props.item.value));
		activeOption.value = selectedItem ? selectedItem.value : null;
	};

	setActiveOption();

	watch(
		() => props.item.value,
		() => {
			setActiveOption();
		}
	);
</script>
