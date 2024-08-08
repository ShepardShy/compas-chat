<script setup lang="ts">
	import { Voice } from "~/components";
	import moment from "moment";

	interface PropsType {
		voiceMessages: any[];
	}

	const props = defineProps<PropsType>();

	const { voiceMessages } = toRefs(props);
</script>

<template>
	<div
		v-for="messagesWithinDay in voiceMessages"
		class="voice-message"
	>
		<div class="voice-message__date">
			{{ moment(messagesWithinDay?.date).format("DD.MM.YYYY") }}
		</div>

		<div class="voice-message__images-wrapper">
			<Voice
				v-for="message in messagesWithinDay.messages"
				:name="message.name"
				:src="message.url"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@use "~/assets/styles/_variables.scss" as variables;

	.voice-message {
		padding: 0 25px;
	}

	.voice-message__date {
		text-align: center;
		margin-bottom: 25px;
		font-size: 20px;
		font-weight: 400;
		color: variables.$color-black;
	}

	.voice-message__images-wrapper {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.voice-message__image {
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
