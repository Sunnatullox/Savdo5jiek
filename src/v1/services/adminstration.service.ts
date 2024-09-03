import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from "../config/db";
import { AdminInfo, Administrator } from '../types/adminstrator.type';

export async function createAdministration(data: Omit<Administrator, 'id' | 'createdAt' | 'updatedAt'>) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.administration.create({
    data: {
      ...data,
      password: hashedPassword,
      AdminInfo: data.AdminInfo ? { create: data.AdminInfo } : undefined,
      Device: data.Device ? { create: data.Device } : undefined, // Adjusted Device property
    },
  });
}

export async function signAccessToken(adminId: string) {
  return jwt.sign({ id: adminId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '5m' });
}

export async function signRefreshToken(adminId: string) {
  return jwt.sign({ id: adminId }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '3d' });
}

export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function administrationFind(adminId: string) {
  return prisma.administration.findUnique({
    where: { id: adminId },
    include: { AdminInfo: true, Device: true },
  });
}

export async function adminstratorInfo(adminId: string) {
  return prisma.adminInfo.findUnique({
    where: { administrationId: adminId },
    include: { Administration: true },
  });
}

export async function adminstratorAddInfoService(data: Omit<AdminInfo, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!data.administrationId) throw new Error("administrationId is required");
  const { Administration, ...restData } = data;
  return prisma.adminInfo.create({
    data: { ...restData, administrationId: data.administrationId as string },
  });
}

export async function adminstratorUpdateInfoService(data: Omit<AdminInfo, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!data.administrationId) throw new Error("administrationId is required");
  const { Administration, ...restData } = data;
  return prisma.adminInfo.update({
    where: { administrationId: data.administrationId as string },
    data: { ...restData, administrationId: data.administrationId as string },
  });
}

export async function findAdminDeviceService(data: {
  ip?: string;
  browser?: string;
  os?: string;
  device?: string;
  administrationId: string;
  device_id?: string;
}) {
  return prisma.device.findFirst({ where: { ...data } });
}

export async function deleteAdminDeviceService(device_id: string) {
  return prisma.device.delete({ where: { id: device_id } });
}