<template>
	<div class="link-message">
		<div class="link-message__icon">
			<img
				v-if="message.image"
				:src="message.image"
				alt="link-icon"
			/>
			<p
				v-else
				class="link-message__letter"
			>
				{{ message.title[0] }}
			</p>
		</div>
		<div class="link-message__body">
			<h2 class="link-message__title">{{ message.title }}</h2>
			<p class="link-message__description">{{ message.description }}</p>
			<a
				v-for="link in message.links"
				:href="link"
				target="_blank"
				class="link-message__link"
				>{{ link }}</a
			>
			<hr class="link-message__line" />
		</div>
	</div>
</template>

<script setup lang="ts">
	interface PropsType {
		message: {
			image?: string;
			title: string;
			description: string;
			links: string[];
		};
	}
	const props = defineProps<PropsType>();

	const { message } = toRefs(props);
</script>

<style scoped>
	@import url(./Link.scss);
</style>
