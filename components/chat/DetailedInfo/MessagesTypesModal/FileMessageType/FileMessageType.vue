<script setup lang="ts">
	import { File } from "~/components";
	import moment from "moment";

	interface PropsType {
		fileMessages: any[];
	}

	const props = defineProps<PropsType>();

	const { fileMessages } = toRefs(props);
</script>

<template>
	<div
		v-for="messagesWithinDay in fileMessages"
		class="file-message"
	>
		<div class="file-message__date">
			{{ moment(messagesWithinDay?.date).format("DD.MM.YYYY") }}
		</div>

		<div class="file-message__images-wrapper">
			<File
				v-for="message in messagesWithinDay.messages"
				:file="message"
			/>
			<!-- <video
				v-for="message in messagesWithinDay.messages"
				:key="message.url"
				:src="message.url"
				class="file-message__image"
				alt="video"
			/> -->
		</div>
	</div>
</template>

<style scoped lang="scss">
	@use "~/assets/styles/_variables.scss" as variables;

	.file-message {
		padding: 0 25px;
	}

	.file-message__date {
		text-align: center;
		margin-bottom: 25px;
		font-size: 20px;
		font-weight: 400;
		color: variables.$color-black;
	}

	.file-message__images-wrapper {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.file-message__image {
		border-radius: 5px;
		height: 113px;
		background-repeat: no-repeat;
		background-position: center center;
		background-size: cover;
		cursor: pointer;
		width: 100%;
		height: 100%;
	}
</style>
