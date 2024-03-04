export interface MessageType {
    id: number
    message: string
    userId: number
    isReceived: boolean
    isViewed: boolean
    isUnread: boolean
    date: string
}

export interface UserChatType {
    id: number
    userId: number
    isGroupChat: boolean
    firstName: string
    secondName: string
    isPinned: boolean
    isActive: boolean
    isTyping: boolean
    photo: string | undefined
    isMutedOff: boolean
    position: string
    messages: MessageType[]
    totalTextMessages: number
    totalPhotoMessages: number
    totalVideoMessages: number
    totalFileMessages: number
    totalVoiceMessages: number
    totalLinksMessages: number
    isMenuOpen: boolean
    isDetailedInfoOpen: boolean
}

export interface GroupChatUserType {
    id: number
    firstName: string
    secondName: string
    isActive: boolean
    isTyping: boolean
    lastTimeActive: string
    photo: string | undefined
    position: string
}

export interface GroupChatMessageType {
    id: number
    userId: number
    firstName: string
    secondName: string
    message: string
    date: string
}

export interface GroupChatType {
    id: number
    isGroupChat: boolean
    title: string
    photo: string
    isPinned: boolean
    isTyping: boolean
    isMutedOff: boolean
    isMenuOpen: boolean
    isDetailedInfoOpen: boolean
    users: GroupChatUserType[]
    messages: GroupChatMessageType[]
}

export interface ChatMenuType {
    title: string
    icon: string
    action: 'detailedChatInfo' | 'editChat' | 'pinChat' | 'muteChat' | 'deleteChat'
    alternativeTitle?: string
}

export interface DetailedInfoMenuItem {
    titleOne: string
    titleTwo: string
    titleThree: string
    icon: string
    action: 'text-messages' | 'images-messages' | 'video-messages' | 'file-messages' | 'voice-messages' | 'link-messages' | 'delete-messages'
}

export type MessagesTypesTitleType = 'Текстовые сообщения'
    | 'Фотографии'
    | 'Видео'
    | 'Файлы'
    | 'Голосовые сообщения' | 'Ссылки'

export interface MessagesTypesType {
    action: 'text-messages' | 'images-messages' | 'video-messages' | 'file-messages' | 'voice-messages' | 'link-messages' | 'delete-messages'
    title: MessagesTypesTitleType
}
