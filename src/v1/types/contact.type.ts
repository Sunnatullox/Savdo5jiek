export interface IContact {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
