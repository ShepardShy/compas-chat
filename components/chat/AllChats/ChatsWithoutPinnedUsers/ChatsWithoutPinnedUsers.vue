<script setup lang="ts">
	import { GroupChat, UserChat } from "~/components";

	import type { UserChatType, GroupChatType } from "~/types/messages";

	/**
	 * Входящие пропсы
	 */
	interface PropsType {
		chatsWithoutPinnedUsers: Array<UserChatType | GroupChatType>;
	}
	const props = defineProps<PropsType>();
	const { chatsWithoutPinnedUsers } = toRefs(props);
</script>

<template>
	<div class="not-pinned">
		<div
			v-for="chat in chatsWithoutPinnedUsers"
			:key="chat.id"
		>
			<UserChat
				v-if="!chat.isGroupChat"
				:chat-data="chat as UserChatType"
			/>

			<GroupChat
				v-if="chat.isGroupChat"
				:chat-data="chat as GroupChatType"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "ChatsWithoutPinnedUsers";
</style>
