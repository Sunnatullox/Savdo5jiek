import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { AdminInfo, Administrator } from "../types/adminstrator.type";

export async function createAdministration(
  data: Omit<Administrator, "id" | "createdAt" | "updatedAt">
) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const hashedTwoFactorSecret = data.twoFactorSecret
    ? await bcrypt.hash(data.twoFactorSecret, 10)
    : "";
  return prisma.administration.create({
    data: {
      ...data,
      password: hashedPassword,
      twoFactorSecret: hashedTwoFactorSecret,
      isTwoFactorAuth: hashedTwoFactorSecret ? true : false,
      AdminInfo: data.AdminInfo ? { create: data.AdminInfo } : undefined,
      Device: data.Device ? { create: data.Device } : undefined, // Adjusted Device property
    },
  });
}

export async function signAccessToken(adminId: string) {
  return jwt.sign({ id: adminId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "5m",
  });
}

export async function signRefreshToken(adminId: string) {
  return jwt.sign({ id: adminId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "3d",
  });
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function administrationFind(adminId: string) {
  return prisma.administration.findUnique({
    where: { id: adminId },
    include: { AdminInfo: true, Device: true },
  });
}

export async function administrationUpdate(
  adminId: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    oldPassword?: string;
  }
) {
  const findAdmin = await administrationFind(adminId);
  if (!findAdmin) throw new Error("Admin not found");

  if (data.password && !data.oldPassword)
    throw new Error("Old password is required");

  if (
    data.password &&
    data.oldPassword &&
    !(await comparePassword(data.oldPassword, findAdmin.password))
  ) {
    throw new Error("Old password is incorrect");
  }
  let hashedPassword;
  if (data.password) hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.administration.update({
    where: { id: adminId },
    data: {
      name: data.name || findAdmin.name,
      email: data.email || findAdmin.email,
      password: hashedPassword || findAdmin.password,
    },
  });
}

export async function adminstratorInfo(adminId: string) {
  return prisma.adminInfo.findUnique({
    where: { administrationId: adminId },
    include: { Administration: true },
  });
}

export async function adminstratorAddInfoService(
  data: Omit<AdminInfo, "id" | "createdAt" | "updatedAt">
) {
  if (!data.administrationId) throw new Error("administrationId is required");
  const { Administration, ...restData } = data;
  return prisma.adminInfo.create({
    data: { ...restData, administrationId: data.administrationId as string },
  });
}

export async function adminstratorUpdateInfoService(
  data: Omit<AdminInfo, "id" | "createdAt" | "updatedAt">
) {
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
  id?: string;
}) {
  return prisma.device.findFirst({ where: { ...data } });
}

export async function getContractsByApprovedService() {
  return prisma.contract.findMany({
    where: {
      status: "approved",
    },
  });
}

export async function deleteAdminDeviceService(device_id: string) {
  return prisma.device.delete({ where: { id: device_id } });
}

export async function getAllTaxAgentsService() {
  return prisma.administration.findMany({
    where: {
      role: "TAX_AGENT",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isTwoFactorAuth: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getTaxAgentByIdService(id: string) {
  return prisma.administration.findUnique({
    where: {
      id,
      role: "TAX_AGENT",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isTwoFactorAuth: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateTaxAgentService(
  id: string,
  data: Omit<Administrator, "id" | "createdAt" | "updatedAt">
) {
  const tax_agentFind = (await getTaxAgentByIdService(id)) as Administrator;
  if (!tax_agentFind) throw new Error("Tax agent not found");
  let hashedPassword;
  if (data.password) hashedPassword = await bcrypt.hash(data.password, 10);

  let twoFactorSecretHash;
  if (data.twoFactorSecret)
    twoFactorSecretHash = await bcrypt.hash(data.twoFactorSecret as string, 10);
  return prisma.administration.update({
    where: {
      id,
      role: "TAX_AGENT",
    },
    data: {
      name: data.name || tax_agentFind.name,
      email: data.email || tax_agentFind.email,
      password: hashedPassword || tax_agentFind.password,
      isTwoFactorAuth:
        (twoFactorSecretHash && true) || tax_agentFind.isTwoFactorAuth,
      twoFactorSecret: twoFactorSecretHash || tax_agentFind.twoFactorSecret,
    },
  });
}

export async function deleteTaxAgentService(id: string) {
  const tax_agentFind = await getTaxAgentByIdService(id);
  if (!tax_agentFind) throw new Error("Tax agent not found");
  return prisma.administration.delete({
    where: {
      id,
      role: "TAX_AGENT",
    },
  });
}
