export function generateOrderCode(): string {
    const now = new Date()
    const datePart = now.toISOString().slice(0, 10).replace(/-/, '')
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase()
    const orderCode = `ORD-${datePart}-${randomPart}` as const
    return orderCode
}