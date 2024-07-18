<script setup lang="ts">
	import { setMessageDay } from "~/composables/chats";
	import { useChatsStore } from "~/store/chats";
	import { useDatePickStore } from "~/store/datePick";
	import { useSettingsStore } from "~/store/settings";

	/**
	 * Входящие пропсы
	 */
	interface PropsType {
		date: string;
		dialogWrapperScrollTop: number;
	}

	const props = defineProps<PropsType>();
	const { date, dialogWrapperScrollTop } = toRefs(props);

	/**
	 * События
	 */
	const emit = defineEmits<{
		(emit: "update:shownDate", value: string): void;
	}>();

	const chatsStore = useChatsStore();
	const datePickStore = useDatePickStore();

	/**
	 * Подключение стора с настройками
	 */
	const settingsStore = useSettingsStore();
	const { isMobileSize } = storeToRefs(settingsStore);

	/** Блок с указанием дня */
	const $messagePhoto = ref<HTMLDivElement>();

	/**
	 * Вывод даты сообщений в подготовленном виде
	 */
	const preparedDay = computed(() => setMessageDay(date.value));
</script>

<template>
	<div
		ref="$messagePhoto"
		class="message__photo other-msg__photo"
		:class="{
			'other-msg__photo_mobile': isMobileSize,
		}"
		style="background-image: linear-gradient(to bottom, #71d2fc 2%, #9490ff 100%)"
	>
		<div class="other-msg__first-name-letter">Ж</div>
	</div>
</template>

<style scoped lang="scss">
	@import "./MessagePhoto";
</style>
