import { AdminInfo, Administration } from "@prisma/client";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from "../config/db";

export async function createAdministration(data: Omit<Administration, 'id' | 'createdAt' | 'updatedAt'>) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return await prisma.administration.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
}

export async function signAccessToken(adminId: string) {
  return jwt.sign({ id: adminId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '5m',
  });
}

export async function signRefreshToken(adminId: string) {
  return jwt.sign({ id: adminId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: '1d',
  });
}


export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}


export async function administrationFind(adminId: string) {
  return await prisma.administration.findUnique({
    where: {
      id: adminId,
    },
    include: {
      AdminInfo: true,
      Device: true,
    },
  });
}

export async function adminstratorInfo(adminId: string) {
  return await prisma.adminInfo.findUnique({
    where: {
      administrationId: adminId,
    },
    include: {
      Administration: true,
    },
  });
}



export async function adminstratorAddInfoService(data: Omit<AdminInfo, 'id' | 'createdAt' | 'updatedAt'>) {
  return await prisma.adminInfo.create({
    data,
  });
}

export async function adminstratorUpdateInfoService(data: Omit<AdminInfo, 'id' | 'createdAt' | 'updatedAt'>) {
  return await prisma.adminInfo.update({
    where: {
        administrationId: data.administrationId as string,
    },
    data,
  });
}

export async function findAdminDeviceService(device_id:string) {
  return await prisma.device.findFirst({
    where:{
      id:device_id
    }
  })
}

export async function deleteAdminDeviceService(device_id:string) {
  return await prisma.device.delete({
    where:{
      id:device_id
    }
  })
}




