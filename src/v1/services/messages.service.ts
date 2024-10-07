import prisma from "../config/db";
import { getContractsByIdService } from "./contract.service";

export const sendMessageUserService = async (
  contractId: string,
  userId: string,
  message: string
): Promise<object> => {
  const messageData = await prisma.message.create({
    data: {
      message,
      userId,
      isReadUser:true,
      contractId,
    },
  });
  return messageData;
};

export const sendMessageAdminService = async (
  adminId: string,
  contractId: string,
  message: string
): Promise<object> => {
  const messageData = await prisma.message.create({
    data: {
      message,
      isAdmin: true,
      isReadAdmin: true,
      contractId,
      adminId,
    },
  });
  return messageData;
};

export const getMessagesUserService = async (userId: string): Promise<object[]> => {
  const messages = await prisma.message.findMany({
    where: {
      userId,
    },
    include: {
      user: true,
      contract: {
        select: {
          id: true,
          contract_id: true,
          paidAmount: true,
          deliveryDate: true,
          status: true,
        },
      },
    },
  });
  return messages;
};

export const getMessagesAdminService = async (adminId: string): Promise<object[]> => {
  const messages = await prisma.message.findMany({
    where: {
      isAdmin: false,
    },
    include: {
      contract: {
        select: {
          id: true,
          contract_id: true,
          paidAmount: true,
          deliveryDate: true,
          status: true,
        },
      },
    },
  });
  return messages;
};


export const getMessagesAdminByContractIdService = async (
  contractId: string
): Promise<object[]> => {
  const messages = await prisma.message.findMany({
    where: {
      contractId
    },
    include: {
      user: true,
    },
  });

  await prisma.message.updateMany({
    where: {
      contractId,
    },
    data: {
      isReadAdmin: true,
    },
  });

  return messages;
};

export const getMessagesUserByContractIdService = async (
  contractId: string,
  userId: string
): Promise<object[]> => {
  const messages = await prisma.message.findMany({
    where: {
      contractId,
      userId,
    },
    include: {
      user: true,
    },
  });
  await prisma.message.updateMany({
    where: {
      contractId,
      userId,
    },
    data: {
      isReadUser: true,
    },
  });
  return messages;
};

export const getNotficationUserService = async (
  userId: string
): Promise<object[]> => {
  const findUserContract = await getContractsByIdService(userId)
  const messages = await prisma.message.findMany({
    where: {
      contractId: {
        in: findUserContract.map((contract) => contract.id),
      },
      isReadUser: false,
      isAdmin: true,
    },
  });
  return messages;
};

export const getNotficationAdminService = async (): Promise<object[]> => {
  const messages = await prisma.message.findMany({
    where: {
      isAdmin: false,
      isReadAdmin: false,
    },
  });
  return messages;
};

export const deleteMessageUserService = async (messageId: string, userId?: string): Promise<void> => {
  await prisma.message.delete({
    where: {
      id: messageId,
      userId: userId,
    },
  });
};

export const deleteMessageAdminService = async (messageId: string, adminId?: string): Promise<void> => {
  await prisma.message.delete({
    where: {
      id: messageId,
      adminId: adminId,
    },
  });
};
