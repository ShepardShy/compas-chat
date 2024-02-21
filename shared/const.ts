import type {ChatMenuType} from '~/types/messages'

export const daysOfWeek = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']

export const chatMenuItems: ChatMenuType[] = [
    {
        title: 'Подбробная информация',
        icon: '',
        action: 'detailedChatInfo'
    },
    {
        title: 'Редактировать',
        icon: '',
        action: 'editChat'
    },
    {
        title: 'Закрепить чат',
        alternativeTitle: 'Открепить чат',
        icon: 'pin-icon.svg',
        action: 'pinChat'
    },
    {
        title: 'Отключить уведомление',
        alternativeTitle: 'Включить уведомление',
        icon: 'mute-off-icon.svg',
        action: 'muteChat'
    },
    {
        title: 'Удалить чат',
        icon: '',
        action: 'deleteChat'
    }
]

export const inputFilesTypes = ['Фото', 'Файл'] as const

export const imagesTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/svg+xml']

export const docTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application / pdf',
    'application / vnd.ms - excel']
