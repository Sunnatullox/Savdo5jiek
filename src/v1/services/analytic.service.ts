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
        monthlyData[month].approvedPayments++;
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
