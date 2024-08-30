import prisma from "../config/db";
import { Prisma } from "@prisma/client";

export async function createPayment(
  data: Prisma.PaymentCreateInput
) {
  return await prisma.payment.create({
    data,
  });
}

export async function getPaymentByIdService(id: string, userId?: string) {
  return await prisma.payment.findFirst({
    where: userId ? { id, userId } : { id },
  });
}

export async function getPaymentsByUserIdService(contractId: string, userId: string) {
  return await prisma.payment.findMany({
    where: { contractId, userId },
  });
}

export async function getPaymentsByContractIdAdminService(contractId: string) {
  return await prisma.payment.findMany({
    where: { contractId },
  });
}

export async function getNotificationPaymentByAdminService() {
  return await prisma.payment.findMany({
    where: { isRead: false },
  });
}

export async function updatePayment(id: string, data: Prisma.PaymentUpdateInput, userId?: string) {
  return await prisma.payment.update({
    where: userId ? { id, userId } : { id },
    data,
  });
}

export async function deletePayment(id: string) {
  return await prisma.payment.delete({
    where: { id },
  });
}
