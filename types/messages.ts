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
}

export interface GroupChatType {
    id: number
    isGroupChat: boolean
    title: string
    img: string
    isPinned: boolean
    isTyping: boolean
    isMutedOff: boolean
    users: GroupChatUserType[]
    messages: GroupChatMessageType[]
}

export interface GroupChatUserType {
    id: number
    firstName: string
    secondName: string
    isActive: boolean
    isTyping: boolean
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
