<script setup lang="ts">
	import { Link } from "~/components";
	import moment from "moment";

	interface PropsType {
		linkMessages: {
			date: string;
			messages: {
				image?: string;
				title: string;
				description: string;
				links: string[];
			}[];
		}[];
	}

	const props = defineProps<PropsType>();

	const { linkMessages } = toRefs(props);
</script>

<template>
	<div
		v-for="messagesWithinDay in linkMessages"
		class="link-messages"
	>
		<div class="link-messages__date">
			{{ moment(messagesWithinDay?.date).format("DD.MM.YYYY") }}
		</div>

		<div class="link-messages__images-wrapper">
			<Link
				v-for="message in messagesWithinDay.messages"
				:message
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@use "~/assets/styles/_variables.scss" as variables;

	.link-messages {
		padding: 0 25px;
	}

	.link-messages__date {
		text-align: center;
		margin-bottom: 25px;
		font-size: 20px;
		font-weight: 400;
		color: variables.$color-black;
	}

	.link-messages__images-wrapper {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.link-messages__image {
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
