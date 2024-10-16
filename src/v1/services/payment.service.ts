import prisma from "../config/db";
import { Prisma } from "@prisma/client";
import { getProductByIdService, updateProductService } from "./product.service";
import { updateContractService } from "./contract.service";

export async function createPayment(data: Prisma.PaymentCreateInput) {
  return await prisma.payment.create({
    data,
  });
}

export async function getPaymentByIdService(id: string, userId?: string) {
  return await prisma.payment.findFirst({
    where: userId ? { id, userId } : { id },
  });
}

export async function getPaymentsByUserService(userId: string) {
  return await prisma.payment.findMany({
    where: { userId },
    include: {
      contract: true,
    },
  });
}

export async function getPaymentsByUserIdService(
  contractId: string,
  userId: string
) {
  return await prisma.payment.findMany({
    where: { contractId, userId },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

export async function getPaymentsByAdminService() {
  return await prisma.payment.findMany({
    include: {
      contract: {
        select: {
          id: true,
          contract_id: true,
          totalPrice: true,
          paidAmount: true,
          paidPercent: true,
          status: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

export async function getPaymentsByContractIdAdminService(contractId: string) {
  await prisma.payment.updateMany({
    where: { contractId, isRead: false },
    data: { isRead: true },
  });
  return await prisma.payment.findMany({
    where: { contractId },
    include: {
      contract: true,
      user: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  
}

export async function getNotificationPaymentByAdminService() {
  return await prisma.payment.findMany({
    where: { isRead: false },
    include:{
      user:true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

export async function updatePayment(
  id: string,
  data: Prisma.PaymentUpdateInput,
  userId?: string
) {
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

export async function updatePaymentAndContractStatus(
  paymentId: string,
  status: string
) {
  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: paymentId },
      include: { contract: true },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (!payment.contract) {
      throw new Error("Contract associated with the payment not found");
    }

    let updatedPaidAmount = payment.contract.paidAmount;
    let paidPercent = (updatedPaidAmount / payment.contract.totalPrice) * 100;

    let productsInContract;
    try {
      productsInContract =
        typeof payment.contract.products === "string"
          ? JSON.parse(payment.contract.products)
          : payment.contract.products;
    } catch (error) {
      throw new Error("Invalid product data format in contract");
    }

    if (status === "approved") {
      updatedPaidAmount += payment.amount;
      paidPercent = (updatedPaidAmount / payment.contract.totalPrice) * 100;

      // Check if the contract's previous paidPercent was less than 30
      const wasPreviouslyBelowThreshold = payment.contract.paidPercent < 30;

      if (paidPercent > 29.99 && wasPreviouslyBelowThreshold) {
        for (const product of productsInContract) {
          const existingProduct = await getProductByIdService(product.id);
          if (existingProduct) {
            try {
              await updateProductService(tx, product.id, {
                stock: existingProduct.stock - product.qty,
              });
            } catch (error) {
              throw new Error(`Failed to update stock for product ${product.id}`);
            }
          }
        }
      }

      await updateContractService(payment.contractId, {
        paidAmount: Number(updatedPaidAmount.toFixed(2)),
        paidPercent: Number(paidPercent.toFixed(2)),
        status: paidPercent > 29.99 ? "approved" : payment.contract.status,
      });
    } else if (status === "rejected" && payment.status === "approved") {
      updatedPaidAmount -= payment.amount;
      paidPercent = (updatedPaidAmount / payment.contract.totalPrice) * 100;
      if (paidPercent < 30) {
        for (const product of productsInContract) {
          const existingProduct = await getProductByIdService(product.id);
          if (existingProduct) {
            try {
              await updateProductService(tx, product.id, {
                stock: existingProduct.stock + product.qty,
              });
            } catch (error) {
              throw new Error(`Failed to update stock for product ${product.id}`);
            }
          }
        }
      }
      await updateContractService(payment.contractId, {
        paidAmount: Number(updatedPaidAmount.toFixed(2)),
        paidPercent: Number(paidPercent.toFixed(2)),
        status: paidPercent < 30 ? "rejected" : payment.contract.status,
      });
    }

    return await tx.payment.update({
      where: { id: paymentId },
      data: { status: status as Prisma.EnumstatusFieldUpdateOperationsInput },
    });
  }, {
    timeout: 10000 // 10 seconds
  });
}
