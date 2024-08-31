import { IDevice } from "./user.type";

export enum Role {
    ADMIN = "ADMIN",
    TAX_AGENT = "TAX_AGENT"
}

export interface Administrator {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    twoFactorSecret?: string;
    AdminInfo?: AdminInfo;
    Device?: IDevice[];
    isTwoFactorAuth?: boolean;
}

export interface AdminInfo {
    id: string;
    company_name: string;
    first_name: string;
    middle_name: string;
    sur_name: string;
    address: string;
    tel: string;
    inn: string;
    oked: string;
    x_r: string;
    bank: string;
    mfo: string;
    organizationLeader: string;
    createdAt: Date;
    updatedAt: Date;
    Administration: Administrator;
    administrationId?: string;
}
