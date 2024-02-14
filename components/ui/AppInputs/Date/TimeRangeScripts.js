export default function (range, isRange) {
    switch (range) {
        case 'yesterday':
            return isRange ? [new Date().setDate(new Date().getDate() - 1), new Date().setDate(new Date().getDate() - 1)] : new Date().setDate(new Date().getDate() - 1)
        case 'today':
            return isRange ? [new Date(), new Date()] : new Date()
        case 'tommorow':
            return isRange ? [new Date().setDate(new Date().getDate() + 1), new Date().setDate(new Date().getDate() + 1)] : new Date().setDate(new Date().getDate() + 1)
        case 'dayAfterTommorow':
            return isRange ? [new Date().setDate(new Date().getDate() + 2), new Date().setDate(new Date().getDate() + 2)] : new Date().setDate(new Date().getDate() + 2)
        case 'currentMonth':
            return isRange ? [new Date().setDate(1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)] : new Date().setDate(1)
        case 'prevMonth':
            return isRange ? [new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), new Date(new Date().getFullYear(), new Date().getMonth(), 0)] : new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
        case 'currentYear':
            return isRange ? [new Date(new Date().getFullYear(), 0, 1), new Date(new Date().getFullYear() + 1, 0, 0)] : new Date(new Date().getFullYear(), 0, 1)
        case 'prevYear':
            return isRange ? [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear(), 0, 0)] : new Date(new Date().getFullYear() - 1, 0, 1)
        default:
            break;
    }
}