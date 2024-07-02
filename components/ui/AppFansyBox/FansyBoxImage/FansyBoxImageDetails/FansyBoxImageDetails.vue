<template>
	<AppPopup
		class="fancybox-item__details popup_actions"
		:close-by-click="true"
	>
		<template #summary>
			<IconDots />
		</template>
		<template #content>
			<PopupOption
				:data-fancybox="`galleryDetails_${props.id}`"
				:href="checkExtension ? props.image.file : props.image.preview"
			>
				Посмотреть
			</PopupOption>
			<PopupOption @click="() => emit('callAction', { action: 'downloadFile', value: props.image })"> Скачать </PopupOption>
			<PopupOption
				class="popup__option_red"
				@click="() => emit('callAction', { action: 'deleteImage', value: props.image.id })"
			>
				Удалить
			</PopupOption>
		</template>
	</AppPopup>
</template>

<script setup>
	import "./FansyBoxImageDetails.scss";

	import { computed } from "vue";
	import IconDots from "~/components/ui/AppIcons/Dots/Dots.vue";
	import PopupOption from "~/components/ui/AppPopup/PopupOption/PopupOption.vue";
	import AppPopup from "~/components/ui/AppPopup/Popup.vue";

	const emit = defineEmits(["callAction"]);

	const props = defineProps({
		image: {
			default: {
				id: 1649,
				url: "/",
				file: "/",
				extension: "png",
			},
			type: () => Object,
		},
		id: {
			default: 0,
			type: Number,
		},
	});

	const checkExtension = computed(() => {
		return ["png", "svg", "jpeg", "jpg", "webp", "pdf", "gif", "mp4", "mp3"].includes(props.image.extension);
	});
</script>
