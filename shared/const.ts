import type { ChatMenuType, DetailedInfoMenuItem } from '~/types/messages'

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

export const detailedInfoMenuItems: DetailedInfoMenuItem[] = [
  {
    titleOne: 'текстовое сообщение',
    titleTwo: 'текстовых сообщений',
    titleThree: 'текстовых сообщений',
    icon: 'text-messages-icon',
    action: 'text-messages'
  },
  {
    titleOne: 'фотография',
    titleTwo: 'фотографии',
    titleThree: 'фотографий',
    icon: 'images-messages-icon',
    action: 'images-messages'
  },
  {
    titleOne: 'видео',
    titleTwo: 'видео',
    titleThree: 'видео',
    icon: 'video-messages-icon',
    action: 'video-messages'
  },
  {
    titleOne: 'файл',
    titleTwo: 'файла',
    titleThree: 'файлов',
    icon: 'file-messages-icon',
    action: 'file-messages'
  },
  {
    titleOne: 'голосовое сообщение',
    titleTwo: 'голосовых сообщений',
    titleThree: 'голосовых сообщений',
    icon: 'voice-messages-icon',
    action: 'voice-messages'
  },
  {
    titleOne: 'ссылка',
    titleTwo: 'ссылки',
    titleThree: 'ссылок',
    icon: 'link-messages-icon',
    action: 'link-messages'
  },
  {
    titleOne: 'Удалить чат',
    titleTwo: 'Удалить чат',
    titleThree: 'Удалить чат',
    icon: 'delete-icon',
    action: 'delete-messages'
  }

] as const
