<template>
	<menu class="menu-doc">
		<div class="menu__container">
			<AppH2 class="menu__title"> Фронтенд </AppH2>
			<ul class="menu__list">
				<li
					v-for="link in Navigation.frontend"
					:key="link.id"
					class="menu__item"
					:class="activeLink.id == link.id ? 'menu__item_active' : ''"
					@click="() => emit('changeLink', link)"
				>
					{{ link.name }}
				</li>
			</ul>
		</div>
		<div class="menu__container">
			<AppH2 class="menu__title"> Бэкенд </AppH2>
			<ul class="menu__list">
				<li
					v-for="link in Navigation.backend"
					:key="link.id"
					class="menu__item"
					:class="activeLink.id == link.id ? 'menu__item_active' : ''"
					@click="() => emit('changeLink', link)"
				>
					{{ link.name }}
				</li>
			</ul>
		</div>
	</menu>
</template>

<script setup>
	import "./DocMenu.scss";

	import { onMounted } from "vue";

	import Navigation from "./Navigation";
	import AppH2 from "~/components/ui/AppH2/AppH2.vue";

	const props = defineProps({
		activeLink: {
			default: () => {},
			type: Object,
		},
	});

	const emit = defineEmits(["changeLink"]);

	onMounted(() => {
		emit("changeLink", Navigation.frontend[5]);
	});
</script>
