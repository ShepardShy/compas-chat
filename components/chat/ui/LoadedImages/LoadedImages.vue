<script setup lang="ts">
	import DeleteFileIcon from "assets/icons/delete-file-icon.svg";

	/**
	 * Входящие пропсы
	 */
	interface PropsType {
		uploadedImages: Array<unknown>;
	}

	const props = defineProps<PropsType>();
	const { uploadedImages } = toRefs(props);

	/**
	 * События
	 */
	const emit = defineEmits<{ (emit: "update:uploadedImages", images: Array<unknown>): void }>();

	/**
	 * Удалить изображение из загруженных
	 */
	const deleteImage = (url: string) => {
		const updatedUploadedImages = [...uploadedImages.value].filter(image => image.url !== url);

		emit("update:uploadedImages", updatedUploadedImages);
	};

	/**
	 * Сокращает выводимое название картинки до 19 символов
	 * @param imageTitle
	 */
	const preparedImageTitle = (imageTitle: string) => {
		if (imageTitle.length < 20) {
			return imageTitle;
		}

		return imageTitle.slice(0, 9) + "..." + imageTitle.slice(-7);
	};
</script>

<template>
	<div
		v-for="image in uploadedImages"
		:key="image.id"
		class="images"
	>
		<div
			class="images__delete-and-icon"
			:style="{
				backgroundImage: `url(${image.url})`,
			}"
		>
			<DeleteFileIcon
				class="images__delete"
				@pointerup.left.stop="deleteImage(image.url)"
			/>
		</div>

		<div class="images__title">
			{{ preparedImageTitle(image.name) }}
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "./LoadedImages";
</style>
