import { daysOfWeek } from '~/shared/const'
import type { GroupChatMessageType } from '~/types/messages'

export const messageTimeInfo = (lastMessage: GroupChatMessageType | {}) => {
  if (lastMessage?.id) {
    const dateParts = lastMessage.date.slice(0, 10).split('.')
    const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0])
    const today = new Date()

    const timeDiff = today.getTime() - date.getTime()
    const oneDay = 24 * 60 * 60 * 1000
    const diffDays = Math.floor(timeDiff / oneDay)

    const dayOfWeek = daysOfWeek[date.getDay()]

    if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
      return lastMessage.date.slice(-5)
    } else if (diffDays <= 7) {
      return dayOfWeek
    } else if (diffDays > 7) {
      return lastMessage.date.slice(0, 5)
    }
  }

  return ''
}

export function getDistanceToViewport (element: unknown) {
  const rect = element.getBoundingClientRect()
  const distanceToTop = rect.top
  const distanceToBottom = window.innerHeight - rect.bottom

  return {
    top: distanceToTop,
    bottom: distanceToBottom
  }
}
