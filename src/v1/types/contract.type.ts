import { IMessage } from "./message.type";
import { IUser } from "./user.type";

export interface IContract {
    id: string;
    contract_id: string;
    totalPrice: number;
    products: any;
    status: IStatus;
    paidPercent: number;
    paidAmount: number;
    isDelivery: boolean;
    shippingAddress?: string;
    paymentEndDate: Date;
    contractEndDate: Date;
    deliveryDate: Date;
    deliveryFile?: any;
    contractFile?: any;
    User: IUser;
    userId: string;
    Payment: any;
    isRead: boolean;
    is_LLC: boolean;
    createdAt: Date;
    updatedAt: Date;
    Message: IMessage[];
}



export enum IStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}