import schedule from 'node-schedule';
import prisma from '../config/db';



const deleteExpiredContracts = async () => {
    try {
        const now = new Date();
        const contracts = await prisma.contract.findMany({
          where: {
            contractEndDate: {
              lte: now.toISOString().slice(0, 10)  // ISO formatdagi sanani olish
            }
          }
        });
      
        for (const contract of contracts) {
          await prisma.contract.delete({
            where: { id: contract.id }
          });
          console.log(`Contract with ID ${contract.id} has been deleted.`);
        }
    } catch (error: any) {
        console.log(error.message)
    }
  };
  
  // Har kuni soat 00:00 da ushbu funksiyani ishga tushirish
  schedule.scheduleJob('0 0 * * *', deleteExpiredContracts);