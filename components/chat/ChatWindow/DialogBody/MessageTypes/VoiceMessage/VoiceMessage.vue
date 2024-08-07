<script setup lang="ts">
	import ReceivedIcon from "assets/icons/recieved-message-icon.svg";
	import ViewedIcon from "assets/icons/viewed-message-icon.svg";
	import Voice from "./components/Voice/Voice.vue";
	import moment from "moment";
	import type { GroupChatMessageType, MessageType } from "~/types/messages";

	interface PropsType {
		message: GroupChatMessageType | MessageType;
		otherMessage?: boolean;
	}

	const props = defineProps<PropsType>();
	const { message, otherMessage } = toRefs(props);

	const isMessageReceived = computed<boolean>(() => {
		return message.value.isReceived && !message.value.isViewed;
	});

	const isMessageViewed = computed<boolean>(() => message.value.isViewed);

	// const senderFullName = computed(() => {
	// 	if (message.value.firstName) {
	// 		return message.value.firstName + " " + message.value?.secondName;
	// 	}

	// 	return message.value.secondName;
	// });
</script>

<template>
	<div class="audio-msg">
		<Voice :src="message.voice![0].url" />
		<div class="audio-msg__time-status">
			<div>{{ moment(message.date)?.format("H:mm") }}</div>
			<div v-if="!otherMessage">
				<ReceivedIcon
					v-if="isMessageReceived"
					style="color: #27ae60"
				/>
				<ViewedIcon
					v-if="isMessageViewed"
					style="color: #27ae60"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import url(./VoiceMessage.scss);
</style>
