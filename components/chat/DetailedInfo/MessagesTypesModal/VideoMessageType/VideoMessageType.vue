<script setup lang="ts">
	import moment from "moment";
	import FansyBox from "~/components/ui/AppFansyBox/FansyBox.vue";

	interface PropsType {
		videoMessages: any[];
	}

	const props = defineProps<PropsType>();
	const { videoMessages } = toRefs(props);
</script>

<template>
	<div
		v-for="messagesWithinDay in videoMessages"
		class="video-message"
	>
		<div class="video-message__date">
			{{ moment(messagesWithinDay?.date).format("DD.MM.YYYY") }}
		</div>

		<FansyBox class="video-message__images-wrapper">
			<video
				v-for="message in messagesWithinDay.messages"
				:key="message.url"
				:src="message.url"
				data-fancybox="gallery"
				class="video-message__image"
				alt="video"
			/>
		</FansyBox>
	</div>
</template>

<style scoped lang="scss">
	@use "~/assets/styles/_variables.scss" as variables;

	.video-message {
		padding: 0 25px;
		overflow-x: hidden;
	}

	.video-message__date {
		text-align: center;
		margin-bottom: 25px;
		font-size: 20px;
		font-weight: 400;
		color: variables.$color-black;
	}

	.video-message__images-wrapper {
		display: grid;
		grid-gap: 5px;
		grid-template-columns: repeat(3, 1fr);
	}

	.video-message__image {
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
