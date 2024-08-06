<script setup lang="ts">
	import XlsDocIcon from "~/assets/icons/xls-doc-icon.svg";
	import WordDocIcon from "~/assets/icons/word-doc-icon.svg";
	import AnyDocIcon from "~/assets/icons/any-doc-icon.svg";
	import DeleteFileIcon from "~/assets/icons/delete-file-icon.svg";

	/**
	 * Входящие пропсы
	 */
	interface PropsType {
		uploadedDocuments: Array<any>;
	}

	const props = defineProps<PropsType>();
	const { uploadedDocuments } = toRefs(props);

	/**
	 * События
	 */
	const emit = defineEmits<{ (emit: "update:uploadedDocuments", documents: Array<unknown>): void }>();

	/**
	 * Удалить документ из загруженных
	 */
	const deleteDocument = (url: string) => {
		const updatedUploadedDocuments = [...uploadedDocuments.value].filter(document => document.url !== url);

		emit("update:uploadedDocuments", updatedUploadedDocuments);
	};

	/**
	 * Сокращает выводимое название документа до 19 символов
	 * @param documentTitle
	 */
	const prepareDocumentTitle = (documentTitle: string) => {
		if (documentTitle.length < 20) {
			return documentTitle;
		}

		return documentTitle.slice(0, 9) + "..." + documentTitle.slice(-7);
	};
</script>

<template>
	<div
		v-for="document in uploadedDocuments"
		:key="document.id"
		class="documents"
	>
		<div class="document__delete-and-icon">
			<DeleteFileIcon
				class="document__delete"
				@pointerup.left.stop="deleteDocument(document.url)"
			/>

			<!--      <iframe-->
			<!--        v-if="document.name.includes('.pdf')"-->
			<!--        :src="document.url"-->
			<!--        class="document__pdf"-->
			<!--        style="overflow:hidden;"-->
			<!--        scrolling="no"-->
			<!--        width="64px"-->
			<!--        height="64px"-->
			<!--      />-->
			<div
				v-if="document.isImage"
				class="images__delete-and-icon"
				:style="{ backgroundImage: `url(${document.url})` }"
				:alt="document.name"
			></div>

			<WordDocIcon
				v-else-if="document.name.includes('.doc')"
				class="document__icon"
			/>

			<AnyDocIcon
				v-else-if="document.name.includes('.pdf')"
				class="document__icon"
			/>

			<XlsDocIcon
				v-else-if="document.name.includes('.xls')"
				class="document__icon"
				style="scale: 2; pointer-events: none"
			/>
			<AnyDocIcon
				v-else-if="!document.name.includes('.xls') && !document.name.includes('.doc') && !document.name.includes('.pdf')"
				class="document__icon"
			/>
		</div>

		<div class="document__title">
			{{ prepareDocumentTitle(document.name) }}
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "./LoadedDocuments";
</style>
