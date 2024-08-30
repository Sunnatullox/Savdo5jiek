import { IContract } from "./contract.type";
import { IUser } from "./user.type";

export interface IMessage {
    id: string;
    message: string;
    isReadAdmin: boolean;
    isReadUser: boolean;
    isAdmin: boolean;
    user: IUser;
    userId: string;
    contract: IContract;
    contractId: string;
    createdAt: Date;
    updatedAt: Date;
}

