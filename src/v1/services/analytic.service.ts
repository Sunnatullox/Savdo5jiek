import prisma from "../config/db";
import { IPayment } from "../types/payment.type";

export const get12MonthPaymentAnalyticsService = async (): Promise<any> => {
  const today = new Date();
  const lastYear = new Date(new Date().setFullYear(today.getFullYear() - 1));

  const payments = await prisma.payment.findMany({
    where: {
      createdAt: {
        gte: lastYear,
      },
      status: "approved",
    },
  });

  const totalPaymentsEver = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: "approved",
    },
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const currentMonth = today.getMonth();
  const orderedMonthNames = [
    ...monthNames.slice(currentMonth + 1), // Start from the month after current
    ...monthNames.slice(0, currentMonth + 1), // Then add months before and including current month
  ].reverse(); // Reverse to start from current month and go backwards

  const monthlyData = Array.from({ length: 12 }, (_, index) => ({
    month: orderedMonthNames[index],
    totalPayments: 0,
    totalAmount: 0,
  }));

  let totalAmountForYear = 0;

  payments.forEach((payment) => {
    const paymentDate = new Date(payment.createdAt);
    const paymentMonth = paymentDate.getMonth();
    const yearDifference = today.getFullYear() - paymentDate.getFullYear();
    const monthIndex = (currentMonth - paymentMonth + 12 * yearDifference) % 12; // Adjust for year difference
    monthlyData[monthIndex].totalPayments++;
    monthlyData[monthIndex].totalAmount += payment.amount;
    totalAmountForYear += payment.amount;
  });

  return {
    monthlyData,
    totalAmountForYear,
    totalPaymentsEver: totalPaymentsEver._sum.amount || 0 // Agar hech qanday to'lov bo'lmagan bo'lsa, 0 qaytariladi
  };
};

export const get12MonthUserRegistrationAnalyticsService = async (): Promise<any> => {
  const today = new Date();
  const lastYear = new Date(new Date().setFullYear(today.getFullYear() - 1));

  const usersLastYear = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: lastYear,
      },
    },
  });

  const totalUsersEver = await prisma.user.count(); // Count all users ever registered

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const currentMonth = today.getMonth();
  const orderedMonthNames = [
    ...monthNames.slice(currentMonth + 1),
    ...monthNames.slice(0, currentMonth + 1),
  ].reverse();

  const monthlyData = Array.from({ length: 12 }, (_, index) => ({
    month: orderedMonthNames[index],
    userRegistrations: 0,
  }));

  let totalRegistrationsLastYear = 0;

  usersLastYear.forEach((user) => {
    const registrationMonth = new Date(user.createdAt).getMonth();
    const yearDifference = today.getFullYear() - new Date(user.createdAt).getFullYear();
    const monthIndex = (currentMonth - registrationMonth + 12 * yearDifference) % 12;
    monthlyData[monthIndex].userRegistrations++;
    totalRegistrationsLastYear++;
  });

  return {
    monthlyData,
    totalRegistrationsLastYear,
    totalUsersEver
  };
};

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

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonth = today.getMonth();
  const orderedMonthNames = [
    ...monthNames.slice(currentMonth),
    ...monthNames.slice(0, currentMonth),
  ];

  const monthlyData = Array.from({ length: 12 }, (_, index) => ({
    month: orderedMonthNames[index],
    totalContracts: 0,
    totalAmount: 0,
    approvedPayments: 0,
  }));

  contracts.forEach((contract) => {
    const month = (contract.createdAt.getMonth() - currentMonth + 12) % 12;
    monthlyData[month].totalContracts++;
    monthlyData[month].totalAmount += contract.totalPrice;
    contract.Payment.forEach((payment: any) => {
      const typedPayment = payment as IPayment;
      if (typedPayment.status === "approved") {
        monthlyData[month].approvedPayments += typedPayment.amount; // O'zgartirilgan qism: faqat sonini emas, balki summasini ham qo'shish
      }
    });
  });

  return monthlyData;
};

export const get12MonthProductSalesAnalyticsService =
  async (): Promise<any> => {
    const today = new Date();
    const lastYear = new Date(today.setFullYear(today.getFullYear() - 1));

    const salesData = await prisma.contract.findMany({
      where: {
        createdAt: {
          gte: lastYear,
        },
        status: "approved",
      },
      include: {
        Payment: {
          where: {
            status: "approved",
          },
        },
      },
    });

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentMonth = today.getMonth();
    const orderedMonthNames = [
      ...monthNames.slice(currentMonth),
      ...monthNames.slice(0, currentMonth),
    ];

    const initializeMonthlyData = () => {
      return Array.from({ length: 12 }, (_, index) => ({
        month: orderedMonthNames[index],
        products: [] as {
          productId: string;
          productName: string;
          unitsSold: number;
          totalSales: number;
        }[],
      }));
    };

    const calculateTotalSales = (product: any) => {
      return product.discount > 0
        ? product.discount * product.qty
        : product.price * product.qty;
    };

    const updateMonthlyData = (
      monthlyData: any[],
      contract: any,
      month: number
    ) => {
      const products =
        typeof contract.products === "string"
          ? JSON.parse(contract.products)
          : contract.products;

      products.forEach((product: any) => {
        const { id: productId, name_uz: productName, qty: unitsSold } = product;
        const totalSales = calculateTotalSales(product);

        const existingProduct = monthlyData[month].products.find(
          (p) => p.productId === productId
        );
        if (existingProduct) {
          existingProduct.unitsSold += unitsSold;
          existingProduct.totalSales += totalSales;
        } else {
          monthlyData[month].products.push({
            productId,
            productName,
            unitsSold,
            totalSales,
          });
        }
      });
    };

    const monthlyData = initializeMonthlyData();

    salesData.forEach((contract) => {
      const month = (contract.createdAt.getMonth() - currentMonth + 12) % 12;
      updateMonthlyData(monthlyData, contract, month);
    });

    return monthlyData;
  };

export const getUserAnalyticsService = async (): Promise<any> => {
  const today = new Date();
  const lastYear = new Date(today.setFullYear(today.getFullYear() - 1));

  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: lastYear,
      },
    },
    include: {
      Contract: {
        where: {
          status: 'approved',
          createdAt: {
            gte: lastYear,
          }
        },
        include: {
          Payment: {
            where: {
              status: 'approved',
            }
          }
        }
      },
      legal_info: true
    }
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonth = today.getMonth();
  const orderedMonthNames = [
    ...monthNames.slice(currentMonth),
    ...monthNames.slice(0, currentMonth),
  ];

  const monthlyData = Array.from({ length: 12 }, (_, index) => ({
    month: orderedMonthNames[index],
    users: [] as any[],
  }));

  users.forEach(user => {
    user.Contract.forEach(contract => {
      const month = (contract.createdAt.getMonth() - currentMonth + 12) % 12;
      const totalPayments = contract.Payment.reduce((sum, payment) => sum + payment.amount, 0);

      const userEntry = monthlyData[month].users.find(u => u.userId === user.id);
      if (userEntry) {
        userEntry.totalContracts++;
        userEntry.totalPayments += totalPayments;
      } else {
        monthlyData[month].users.push({
          userId: user.id,
          userName: user.full_name,
          totalContracts: 1,
          totalPayments: totalPayments,
          phoneNumber: user.is_LLC ? user.legal_info?.phone_number : user.phone_number
        });
      }
    });
  });

  return monthlyData;
};

export const getLowStockProductsService = async (): Promise<any> => {
  const products = await prisma.product.findMany({
    where: {
      stock: {
        lt: 100,
      },
    },
    orderBy: {
      stock: "asc",
    },
  });

  return products.map((product) => ({
    ...product,
    color: product.stock < 50 ? "red" : "yellow",
  }));
};
