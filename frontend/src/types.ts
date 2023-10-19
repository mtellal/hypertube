export type Tag = {
    tagId: number, 
    tag: string
}

export type Notification = {
    id: string, 
    firstName: string, 
    userId: number | string, 
    createdAt: Date | string,

    user?: any,
    convId?: string, 
    userId1?: string,
    userId2?: string,
    action?: string
}