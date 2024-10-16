<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<Teleport to="body">
		<AppModal v-if="modals.length > 0" />
	</Teleport>
</template>

<script setup lang="ts">
	import AppModal from "~/components/ui/AppModal/Modal.vue";
	import { useModalStore } from "~/store/modal";
	import { useChatsStore } from "~/store/chats";

	const chatsStore = useChatsStore();
	await chatsStore.loadChats();

	const modalStore = useModalStore();
	const modals = modalStore.modals;

	provide("modals", modals);

	// Скрытие клавиатуры Safari
	onMounted(() => {
		document.body.addEventListener("pointerdown", () => {
			document.body.firstElementChild.tabIndex = 1;
		});
	});

	// отключение скрола у body
	onMounted(() => {
		document.body.addEventListener("scroll", e => e.preventDefault(), { passive: false });
		window.screen;
	});
</script>
