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
		isFirstDate: boolean;
		dialogWrapperScrollTop: number;
		lastDate: boolean;
		shownDate: string;
	}

	const props = defineProps<PropsType>();
	const { date, isFirstDate, dialogWrapperScrollTop, lastDate, shownDate } = toRefs(props);

	/**
	 * События
	 */
	const emit = defineEmits<{
		(emit: "update:shownDate", value: string): void;
	}>();

	const chatsStore = useChatsStore();
	const datePickStore = useDatePickStore();

	/**
	 * Открытие модалки для выбора даты
	 */
	const openModalToDatePick = () => {
		const currentUserData = {
			lastTimeActive: formattedDateToday(),
		};

		// chatsStore.$patch(
		// 	state =>
		// 		(state.temporalStorageForGroupChat = {
		// 			...state.temporalStorageForGroupChat,
		// 			users: [currentUserData],
		// 		})
		// );
		datePickStore.date = date.value;
		chatsStore.isDatePickModalOpen = true;
	};

	/**
	 * Подключение стора с настройками
	 */
	const settingsStore = useSettingsStore();
	const { isMobileSize } = storeToRefs(settingsStore);

	/** Блок с указанием дня */
	const $messageBlock = ref<HTMLDivElement>();

	/**
	 * Вывод даты сообщений в подготовленном виде
	 */
	const preparedDay = computed(() => setMessageDay(date.value));

	const dialogBody = ref();
	const dialogWrapper = ref();
	const topPosition = ref();

	onMounted(() => {
		dialogWrapper.value = $messageBlock.value.closest(".dialog__wrapper");
		dialogBody.value = $messageBlock.value.closest(".dialog__body");

		if (dialogBody.value?.offsetTop < dialogWrapper.value?.offsetTop && lastDate.value) {
			topPosition.value = dialogWrapper.value.offsetTop + "px";
		} else {
			topPosition.value = "0";
		}
	});
	watch(
		() => dialogWrapperScrollTop.value,
		() => {
			requestAnimationFrame(setTopPosition);
		}
	);

	/**
	 * Проверяет как далеко скролл сообщений и задает значение для div, который динамически отражает дату
	 */
	const setTopPosition = () => {
		const nextDatePosition = dialogBody.value.nextElementSibling?.offsetTop;
		const currentShownDatePosition = dialogBody.value.offsetTop;

		if (dialogWrapperScrollTop.value > currentShownDatePosition && nextDatePosition && dialogWrapperScrollTop.value < nextDatePosition - 41) {
			emit("update:shownDate", date.value);
			return;
		} else if (dialogWrapperScrollTop.value > currentShownDatePosition && +lastDate.value - 41) {
			emit("update:shownDate", date.value);
		}
	};
</script>

<template>
	<div
		ref="$messageBlock"
		class="message-block"
		:style="{
			marginTop: isFirstDate && '0',
			transform: isMobileSize ? `translateX(calc(-50%))` : `translateX(calc(-50% + 15px))`,
		}"
	>
		<div
			class="message-block__wrapper"
			:class="{
				'message-block__wrapper_today': preparedDay === 'Сегодня',
				'message-block__wrapper_mobile': isMobileSize,
			}"
		>
			<div
				v-if="!(shownDate == date)"
				@click="openModalToDatePick"
				class="message-block__date"
				:class="{
					'message-block__date_today': preparedDay === 'Сегодня',
				}"
			>
				{{ preparedDay }}
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "./MessageDay";
</style>
