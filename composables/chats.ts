import { daysOfWeek, daysOfWeekLongName } from "~/shared/const";
import type { DetailedInfoMenuItem, GroupChatMessageType, GroupChatType, UserChatType } from "~/types/messages";

/**
 *
 * @param _openModalChatData
 * @param _item
 */
export const showModalMenuItemTitle = (_openModalChatData: UserChatType | GroupChatType, _item: DetailedInfoMenuItem) => {
	switch (_item.action) {
		case "text-messages": {
			return setCorrectTitle(_openModalChatData.totalTextMessages, _item);
		}
		case "images-messages": {
			return setCorrectTitle(_openModalChatData.totalPhotoMessages, _item);
		}

		case "video-messages": {
			return setCorrectTitle(_openModalChatData.totalVideoMessages, _item);
		}

		case "file-messages": {
			return setCorrectTitle(_openModalChatData.totalFileMessages, _item);
		}

		case "voice-messages": {
			return setCorrectTitle(_openModalChatData.totalVoiceMessages, _item);
		}

		case "link-messages": {
			return setCorrectTitle(_openModalChatData.totalLinksMessages, _item);
		}

		case "delete-messages": {
			return _item.titleOne;
		}
	}
};

export function setCorrectTitle(_quantity: number, _item: DetailedInfoMenuItem) {
	const _lastDigit = _quantity.toString().slice(-1);
	if (+_lastDigit === 1) {
		return _quantity + " " + _item.titleOne;
	} else if (+_lastDigit >= 2 && +_lastDigit <= 4) {
		return _quantity + " " + _item.titleTwo;
	} else {
		return _quantity + " " + _item.titleThree;
	}
}

export const messageTimeInfo = (lastMessage: GroupChatMessageType | {}) => {
	if (lastMessage?.id) {
		const dateParts = lastMessage.date.slice(0, 10).split(".");
		const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
		const today = new Date();

		const timeDiff = today.getTime() - date.getTime();
		const oneDay = 24 * 60 * 60 * 1000;
		const diffDays = Math.floor(timeDiff / oneDay);

		const dayOfWeek = daysOfWeek[date.getDay()];

		if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
			return lastMessage.date.slice(-5);
		} else if (diffDays <= 7) {
			return dayOfWeek;
		} else if (diffDays > 7) {
			return lastMessage.date.slice(0, 5);
		}
	}

	return "";
};

export function getDistanceToViewport(element: unknown) {
	const rect = element.getBoundingClientRect();
	const distanceToTop = rect.top;
	const distanceToBottom = window.innerHeight - rect.bottom;

	return {
		top: distanceToTop,
		bottom: distanceToBottom,
	};
}

export const userActiveTime = (lastTimeActive: string) => {
	const dateParts = lastTimeActive.slice(0, 10).split(".");
	const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
	const today = new Date();

	const timeDiff = today.getTime() - date.getTime();
	const oneDay = 24 * 60 * 60 * 1000;
	const diffDays = Math.floor(timeDiff / oneDay);

	const dayOfWeek = daysOfWeek[date.getDay()];

	if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
		return `сегодня в ${lastTimeActive.slice(-5)}`;
	} else if (diffDays <= 7) {
		return `${dayOfWeek.toUpperCase()} в ${lastTimeActive.slice(-5)}`;
	} else if (diffDays > 7) {
		return `${lastTimeActive.slice(0, 10)} в ${lastTimeActive.slice(-5)}`;
	}
};

export const setMessageDay = (dateFromMessage: string) => {
	if (!dateFromMessage) return;
	const dateParts = dateFromMessage.slice(0, 10).split(".");
	const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
	const today = new Date();

	const timeDiff = today.getTime() - date.getTime();
	const oneDay = 24 * 60 * 60 * 1000;
	const diffDays = Math.floor(timeDiff / oneDay);

	const dayOfWeek = daysOfWeekLongName[date.getDay()];

	if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
		return "Сегодня";
	} else if (diffDays <= 7) {
		return dayOfWeek;
	} else if (diffDays > 7) {
		return dateFromMessage.slice(0, 10);
	}
};

export const formattedDateToday = () => {
	const todayDate = new Date();

	const year = todayDate.getFullYear();
	const month = String(todayDate.getMonth() + 1).padStart(2, "0");
	const day = String(todayDate.getDate()).padStart(2, "0");
	const hours = String(todayDate.getHours()).padStart(2, "0");
	const minutes = String(todayDate.getMinutes()).padStart(2, "0");

	const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
	return formattedDate;
};

/**
 * Отображение сообщения
 * @param messageText - текст сообщения или комментария
 * @param messagesQuantity - количсевто файлов в сообщении
 * @param singleFileName - имя единственного отправленного файла
 * @param commonWordForMessage - если файлов много, то слово описания их содержимого
 */
export const showMessage = (messageText: string | undefined, messagesQuantity?: number, singleFileName?: string, commonWordForMessage?: string): string => {
	if (!commonWordForMessage) {
		return messageText!;
	}

	if (messagesQuantity && messagesQuantity === 1) {
		return singleFileName!;
	}

	return messageText || commonWordForMessage;
};
