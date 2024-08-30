import { IContract, IStatus } from "./contract.type";
import { IUser } from "./user.type";

export interface IPayment {
    id: string;
    contract: IContract;
    contractId: string;
    user: IUser;
    userId: string;
    amount: number;
    receiptImage: string;
    paidDate: Date;
    isRead: boolean;
    status: IStatus;
    createdAt: Date;
    updatedAt: Date;
}