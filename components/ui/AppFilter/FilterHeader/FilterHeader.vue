<template>
	<div
		class="filter__header"
		:style="`--inputPadding: ${paddingInput}px`"
	>
		<AppInput
			ref="inputRef"
			:item="{
				id: 0,
				key: 'search',
				value: search,
				placeholder: localTabs.length > 0 ? '+ Поиск' : 'Фильтр + Поиск',
			}"
			:disabled="findSearchTab"
			:enabled-autocomplete="false"
			@keyup.enter="() => emit('actionFilter', { action: 'search', data: null })"
			@keyup.delete="e => deleteFilter(e)"
			@change-value="data => emit('changeSearch', data)"
		/>

		<div
			ref="tabsRef"
			class="filter__tabs"
		>
			<div
				v-for="tab in localTabs"
				:key="tab.title"
				class="filter__tab filter-tab"
			>
				<div class="filter-tab__title">{{ tab.title }}: {{ tab.preview }}</div>
				<IconDelete @click="() => emit('actionFilter', { action: 'removeFilter', value: tab })" />
			</div>
			<div
				v-if="hiddenTabs.length > 0"
				class="filter__tab filter-tab"
			>
				<div class="filter-tab__title">и еще {{ hiddenTabs.length }}</div>
				<IconDelete @click="() => emit('actionFilter', { action: 'removeHiddenFilters', value: hiddenTabs })" />
			</div>
		</div>

		<div
			v-if="findSearchTab"
			class="filter__clickable"
		/>
	</div>
</template>

<script setup>
	import "./FilterHeader.scss";

	import { ref, watch, inject, onMounted, computed } from "vue";

	import AppInput from "~/components/ui/AppInputs/Input/Input.vue";
	import IconDelete from "~/components/ui/AppIcons/Delete/Delete.vue";

	const paddingInput = ref(0);
	const tabsRef = ref(null);
	const inputRef = ref(null);
	const localTabs = ref([]);
	const hiddenTabs = ref([]);
	const prevValue = ref(null);

	const props = defineProps({
		tabs: {
			default: [],
			type: () => Array,
		},
	});

	const search = inject("search");

	const emit = defineEmits(["toggleMenu", "changeSearch", "actionFilter"]);

	onMounted(() => {
		localTabs.value = props.tabs;

		observer.observe(tabsRef.value, {
			childList: true, // наблюдать за непосредственными детьми
			subtree: true, // и более глубокими потомками
			characterDataOldValue: true, // передавать старое значение в колбэк
		});
	});

	watch(
		() => props.tabs,
		(newVal, prevVal) => {
			hiddenTabs.value = [];
			localTabs.value = props.tabs;

			if (newVal.length < prevVal.length) {
				inputRef.value.inputRef.inputRef.focus();
			}

			setTimeout(() => {
				paddingInput.value = tabsRef.value.offsetWidth;
			}, 50);
		}
	);

	// Удаление фильтра по нажатию backspace
	const deleteFilter = () => {
		if (localTabs.value.length > 0) {
			if ([null, undefined].includes(search.value) || (prevValue.value == search.value && search.value == "")) {
				emit("actionFilter", { action: "removeFilter", value: localTabs.value[localTabs.value.length - 1] });
			}
		}
		prevValue.value = search.value;
	};

	// Отслеживание изменения длины плашек
	const observer = new MutationObserver(() => {
		// Найти самый длинный элемент
		const findLongerItem = () => {
			let maxField = null;
			let maxFieldLength = 0;
			let tabLength = 0;

			for (const tab of localTabs.value) {
				tabLength = tab.title == null ? 0 : tab.title.length + tab.value.length;
				if (maxFieldLength == 0 || tabLength > maxFieldLength) {
					maxField = tab;
					maxFieldLength = tabLength;
				}
			}
			return maxField;
		};

		if (inputRef.value.inputRef.inputRef.offsetWidth < tabsRef.value.offsetWidth + 100) {
			const field = findLongerItem();
			hiddenTabs.value.push(field);
			localTabs.value = localTabs.value.filter(tab => tab.key != field.key);
		}
	});

	// Нахождение поиска
	const findSearchTab = computed(() => {
		return !!(localTabs.value.find(tab => tab.key == null) || hiddenTabs.value.find(tab => tab.key == null));
	});
</script>
