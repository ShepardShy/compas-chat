<script setup lang="ts">
	import { setMessageDay } from "~/composables/chats";
	import { useChatsStore } from "~/store/chats";
	import { useDatePickStore } from "~/store/datePick";
	import { useSettingsStore } from "~/store/settings";

	/**
	 * Входящие пропсы
	 */
	interface PropsType {
		firstName: string;
		photo?: string;
	}

	const props = defineProps<PropsType>();
	const { firstName, photo } = toRefs(props);

	/**
	 * Подключение стора с настройками
	 */
	const settingsStore = useSettingsStore();
	const { isMobileSize } = storeToRefs(settingsStore);

	/***
	 * Фото пользователя или если его нет заливка гралиентом
	 */
	const isHavePhoto = ref(false);
	if (photo.value) {
		isHavePhoto.value = true;
	}
	const chatPhoto = computed<string>(() => {
		if (photo.value) {
			return `url(${photo.value})`;
		} else {
			return "linear-gradient(to bottom, #71d2fc 2%, #9490ff 100%)";
		}
	});
</script>

<template>
	<div
		class="message__photo other-msg__photo"
		:class="{
			'other-msg__photo_mobile': isMobileSize,
		}"
		:style="`background-image: ${chatPhoto}`"
	>
		<div class="other-msg__first-name-letter">{{ !isHavePhoto ? firstName?.[0] : "" }}</div>
	</div>
</template>

<style scoped lang="scss">
	@import "./MessagePhoto";
</style>
