import prisma from "../config/db";
import { Prisma } from "@prisma/client";

export async function createContractService(
  data: Prisma.ContractCreateInput
) {
  return await prisma.contract.create({
    data,
  });
}

export async function getContractsByAdminService() {
  return await prisma.contract.findMany({
    include: {
      User: {
        include: {
          legal_info: true,
        },
      }
    },
  });
}

export async function getContractsByIdService(id: string, is_LLC?: boolean) {
  return await prisma.contract.findMany({
    where:  { userId: id ,is_LLC},
    include: {
      User: {
        include: {
          legal_info: is_LLC,
        },
      }
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

export async function getContractByIdService(id: string, userId?: string) {
  const contract = await prisma.contract.findUnique({
    where: userId ? { id, userId } : { id },
    include: {
      User: {
        include: {
          legal_info: true,
        },
      },
      Payment: true,
    },
  });
  if (!userId) {
    await prisma.contract.update({
      where: { id },
      data: { isRead: true },
    });
    await prisma.payment.updateMany({
      where: { contractId: id, isRead: false },
      data: { isRead: true },
    });
  }
  return contract
}

export async function updateContractService(id: string, data: Partial<Prisma.ContractUpdateInput>) {
  return await prisma.contract.update({
    where: { id },
    data: {
      ...data,
      Payment:{
        updateMany:{
          where:{contractId:id},
          data:{isRead:true}
        }
      }
    },
  });
}

export async function deleteContractService(id: string) {
  return await prisma.contract.delete({
    where: { id },
  });
}

export async function newNotifsContractisAdmin() {
  return await prisma.contract.findMany({
    where: {
      isRead: false
    },
    include: {
      User: true
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}

export async function addBusinessDays(date: Date, days: number): Promise<Date> {
  let count = 0;
  while (count < days) {
    date.setDate(date.getDate() + 1);
    // Check if it's a weekday (Monday to Friday)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      count++;
    }
  }
  return date;
}

export async function getContractByTaxAgentService(query:Prisma.ContractFindManyArgs){
  return await prisma.contract.findMany(query)
}
