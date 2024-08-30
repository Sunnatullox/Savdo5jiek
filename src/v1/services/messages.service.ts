import prisma from "../config/db";

export const sendMessageUserService = async (
  contractId: string,
  userId: string,
  message: string
): Promise<object> => {
  const messageData = await prisma.message.create({
    data: {
      message,
      userId,
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
      contractId,
      userId: adminId,
    },
  });
  return messageData;
};

// export const getMessagesUser = async (userId: string): Promise<object[]> => {
//   const messages = await prisma.message.findMany({
//     where: {
//       userId,
//     },
//     include: {
//       contract: true,
//     },
//   });
//   return messages;
// };

// export const getMessagesAdmin = async (): Promise<object[]> => {
//   const messages = await prisma.message.findMany({
//     where: {
//       isAdmin: true,
//     },
//     include: {
//       contract: true,
//     },
//   });
//   return messages;
// };

export const getMessagesAdminByContractIdService = async (
  contractId: string
): Promise<object[]> => {
  const messages = await prisma.message.findMany({
    where: {
      contractId,
      isAdmin: true,
    },
    include: {
      user: true,
      contract: true,
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
      contract: true,
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
  const messages = await prisma.message.findMany({
    where: {
      userId,
      isReadUser: false,
    },
  });
  return messages;
};

export const getNotficationAdminService = async (): Promise<object[]> => {
  const messages = await prisma.message.findMany({
    where: {
      isAdmin: true,
      isReadAdmin: false,
    },
  });
  return messages;
};
