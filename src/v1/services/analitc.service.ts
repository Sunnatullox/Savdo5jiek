import prisma from "../config/db";
import { IPayment } from "../types/payment.type";

export const get12MonthContractAnalyticsService = async (): Promise<any> => {
  const today = new Date();
  const lastYear = new Date(today.setFullYear(today.getFullYear() - 1));

  const contracts = await prisma.contract.findMany({
    where: {
      createdAt: {
        gte: lastYear,
      },
    },
    include: {
      Payment: true,
    },
  });

  const monthlyData = contracts.reduce((acc: any, contract: any) => {
    const month = contract.createdAt.getMonth();
    if (!acc[month]) {
      acc[month] = { totalContracts: 0, totalAmount: 0, approvedPayments: 0 };
    }
    acc[month].totalContracts++;
    acc[month].totalAmount += contract.totalPrice;
    contract.Payment.forEach((payment: IPayment) => {
      if (payment.status === "approved") {
        acc[month].approvedPayments++;
      }
    });
    return acc;
  }, {});

  return monthlyData;
};


export const get12MonthProductSalesAnalyticsService = async (): Promise<any> => {
  const today = new Date();
  const lastYear = new Date(today.setFullYear(today.getFullYear() - 1));

  const salesData = await prisma.contract.findMany({
    where: {
      createdAt: {
        gte: lastYear,
      },
      status: "approved", // Assuming you only want to analyze approved contracts
    },
    include: {
      Payment: {
        where: {
          status: "approved",
        },
      },
    },
  });

  const monthlyProductData = salesData.reduce((acc: { [key: string]: number[] }, contract) => {
    const month = contract.createdAt.getMonth();
    const products =
      typeof contract.products === "string"
        ? JSON.parse(contract.products)
        : contract.products;
    products.forEach((product: any) => {
      const productId = product.id;
      const quantity = product.quantity;
      if (!acc[productId]) {
        acc[productId] = Array(12).fill(0);
      }
      acc[productId][month] += quantity;
    });
    return acc;
  }, {});

  return monthlyProductData;
};


export const getUserAnalyticsService = async (): Promise<any> => {
    const today = new Date();
    const lastYear = new Date(today.setFullYear(today.getFullYear() - 1));
  
    // Fetch users created in the last 12 months
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: lastYear,
        },
      },
    });
  
    // Aggregate monthly user registrations
    const monthlyRegistrations = users.reduce((acc, user) => {
      const month = user.createdAt.getMonth();
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, Array(12).fill(0));
  
    // Fetch contracts and payments for these users
    const contracts = await prisma.contract.findMany({
      where: {
        createdAt: {
          gte: lastYear,
        },
      },
      include: {
        Payment: true,
      },
    });
  
    // Aggregate contracts and payments by user
    const userContracts: { [key: string]: { totalContracts: number; monthlyPayments: number[] } } = {};
    contracts.forEach((contract: any) => {
      const month = contract.createdAt.getMonth();
      if (!userContracts[contract.userId]) {
        userContracts[contract.userId] = {
          totalContracts: 0,
          monthlyPayments: Array(12).fill(0),
        };
      }
      userContracts[contract.userId].totalContracts++;
      contract.Payment.forEach((payment: IPayment) => {
        userContracts[contract.userId].monthlyPayments[month] += payment.amount;
      });
    });
  
    return {
      monthlyRegistrations,
      userContracts,
    };
};


export const getLowStockProductsService = async (): Promise<any> => {
    const products = await prisma.product.findMany({
      where: {
        quantity: {
          lt: 100, // Less than 100 units in stock
        },
      },
      orderBy: {
        quantity: 'asc', // Order by ascending quantity
      },
    });
  
    const highlightedProducts = products.map((product: any) => {
      let color = 'yellow'; // Default to yellow
      if (product.quantity < 50) {
        color = 'red'; // Set to red if quantity is less than 50
      }
      return {
        ...product,
        color, // Add color property based on stock level
      };
    });
  
    return highlightedProducts;
};