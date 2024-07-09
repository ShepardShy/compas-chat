<template>
	<div>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
	<Teleport to="body">
		<AppModal v-if="modals.length > 0" />
	</Teleport>
</template>

<script setup lang="ts">
	import AppModal from "~/components/ui/AppModal/Modal.vue";
	import { useModalStore } from "~/store/modal";

	const modalStore = useModalStore();
	const modals = modalStore.modals;

	provide("modals", modals);

	// Скрытие клавиатуры Safari

	onMounted(() => {
		document.body.addEventListener("pointerdown", () => {
			document.body.firstElementChild.tabIndex = 1;
		});
	});
</script>
