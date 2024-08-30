import { Administrator } from "./adminstrator.type";
import { IContract } from "./contract.type";
import { IMessage } from "./message.type";
import { IPayment } from "./payment.type";

export interface IUser {
  id: string;
  middle_name: string;
  valid: boolean;
  birth_date: string;
  address?: string;
  phone_number?: string;
  passport_no: string;
  sur_name: string;
  pin_jshshir: string;
  birth_place: string;
  user_id: string;
  user_type: string;
  first_name: string;
  full_name: string;
  legal_info?: ILegalInfo;
  is_LLC: boolean;
  createdAt: Date;
  updatedAt: Date;
  Contract: IContract[];
  Message: IMessage[];
  Payment: IPayment[];
  Device: IDevice[];
}

export interface ILegalInfo {
  id: string;
  name?: string;
  le_name?: string;
  inn?: string;
  phone_number?: string;
  tin?: string;
  oked?: string;
  mfo?: string;
  x_r?: string;
  bank?: string;
  address?: string;
  organizationLeader?: string;
  createdAt: Date;
  updatedAt: Date;
  User: IUser;
  userId: string;
}

export interface IOTP {
  id: string;
  email: string;
  code: string;
  type: string;
  user: IUser;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface IDevice {
  id: string;
  ip: string;
  browser: string;
  os: string;
  device: string;
  createdAt: Date;
  updatedAt: Date;
  User?: IUser;
  userId?: string;
  Administration?: Administrator;
  administrationId?: string;
}
