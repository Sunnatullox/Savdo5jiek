import schedule from "node-schedule";
import prisma from "../config/db";
import fs from "fs";
import { deletePayment } from "../services/payment.service";
import { deleteMessageAdminService } from "../services/messages.service";

const deleteExpiredContracts = async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedYesterday = yesterday.toISOString().slice(0, 10);

    const contracts = await prisma.contract.findMany({
      where: {
        contractEndDate: {
          lte: formattedYesterday,
        },
        Payment: {
          some: {
            status: {
              not: "approved",
            },
          },
        },
        status: {
          not: "approved",
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        Payment: true,
        Message: true,
      },
    });

    // Delete payments and messages in parallel
    await Promise.all(contracts.map(async (contract) => {
      await Promise.all(contract.Payment.map(async (payment) => {
        await deleteFile(payment.receiptImage as string);
        await deletePayment(payment.id);
      }));

      await Promise.all(contract.Message.map(async (message) => {
        await deleteMessageAdminService(message.id);
      }));

      const contractFile = contract.contractFile as any;
      if (contractFile) {
        if (contractFile.contractFileUz) {
          await deleteFile(contractFile.contractFileUz as string);
        }
        if (contractFile.contractFileRu) {
          await deleteFile(contractFile.contractFileRu as string);
        }
      }

      await prisma.contract.delete({
        where: { id: contract.id },
      });
      console.log(`Contract with ID ${contract.id} has been deleted.`);
    }));
  } catch (error: any) {
    console.log(error.message);
  }
};

// Delete contract files
async function deleteFile(fileUrl: string) {
  const url = new URL(fileUrl);
  const filePath = `.${url.pathname}`;
  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath).catch((err) => {
      throw err;
    });
  }
}

// Har kuni soat 00:00 da ushbu funksiyani ishga tushirish
schedule.scheduleJob("0 0 * * *", deleteExpiredContracts);
