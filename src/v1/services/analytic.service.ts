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

  // Calculate percentage change and level for the last month
  const lastMonthData = monthlyData[0];
  const previousMonthData = monthlyData[1];

  let percentageChange = 0;
  let level = "";

  if (previousMonthData.totalPayments > 0) {
    percentageChange =
      ((lastMonthData.totalPayments - previousMonthData.totalPayments) /
        previousMonthData.totalPayments) *
      100;
    level = percentageChange > 0 ? "levelUp" : "levelDown";
  } else {
    percentageChange = lastMonthData.totalPayments > 0 ? 100 : 0;
    level = lastMonthData.totalPayments > 0 ? "levelUp" : "levelDown";
  }

  return {
    monthlyData,
    totalAmountForYear,
    totalPaymentsEver: totalPaymentsEver._sum.amount || 0, // Return 0 if no payments
    percentageChange,
    level,
  };
};

export const get12MonthUserRegistrationAnalyticsService =
  async (): Promise<any> => {
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
      const yearDifference =
        today.getFullYear() - new Date(user.createdAt).getFullYear();
      const monthIndex =
        (currentMonth - registrationMonth + 12 * yearDifference) % 12;
      monthlyData[monthIndex].userRegistrations++;
      totalRegistrationsLastYear++;
    });

    // Calculate percentage change and level for the last month
    const lastMonthData = monthlyData[0];
    const previousMonthData = monthlyData[1];

    let percentageChange = 0;
    let level = "";

    if (previousMonthData.userRegistrations > 0) {
      percentageChange =
        ((lastMonthData.userRegistrations -
          previousMonthData.userRegistrations) /
          previousMonthData.userRegistrations) *
        100;
      level = percentageChange > 0 ? "levelUp" : "levelDown";
    } else {
      percentageChange = lastMonthData.userRegistrations > 0 ? 100 : 0;
      level = lastMonthData.userRegistrations > 0 ? "levelUp" : "levelDown";
    }

    return {
      monthlyData,
      totalRegistrationsLastYear,
      totalUsersEver,
      percentageChange,
      level,
    };
  };

export const get12MonthContractAnalyticsService = async (): Promise<any> => {
  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);

  const contractsLastYear = await prisma.contract.findMany({
    where: {
      createdAt: {
        gte: lastYear,
      },
    },
    include: {
      Payment: true,
    },
  });

  const totalContractsEver = await prisma.contract.count(); // Count all contracts ever created

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
    ...monthNames.slice(currentMonth + 1),
    ...monthNames.slice(0, currentMonth + 1),
  ].reverse();

  const monthlyData = Array.from({ length: 12 }, (_, index) => ({
    month: orderedMonthNames[index],
    totalContracts: 0,
    totalAmount: 0,
    approvedPayments: 0,
  }));

  contractsLastYear.forEach((contract) => {
    const contractDate = new Date(contract.createdAt);
    const contractMonth = contractDate.getMonth();
    const yearDifference = today.getFullYear() - contractDate.getFullYear();
    const monthIndex = (currentMonth - contractMonth + 12) % 12; // Adjust for year difference

    // Ensure monthIndex is within the valid range
    if (monthIndex < 0 || monthIndex >= 12) {
      console.error(
        `Invalid monthIndex: ${monthIndex} for contract date: ${contractDate}`
      );
      return;
    }

    monthlyData[monthIndex].totalContracts++;
    monthlyData[monthIndex].totalAmount += contract.totalPrice;
    contract.Payment.forEach((payment: any) => {
      const typedPayment = payment as IPayment;
      if (typedPayment.status === "approved") {
        monthlyData[monthIndex].approvedPayments += typedPayment.amount;
      }
    });
  });

  // Calculate percentage change and level for the last month
  const lastMonthData = monthlyData[0];
  const previousMonthData = monthlyData[1];

  let percentageChange = 0;
  let level = "";

  if (previousMonthData.totalContracts > 0) {
    percentageChange =
      ((lastMonthData.totalContracts - previousMonthData.totalContracts) /
        previousMonthData.totalContracts) *
      100;
    level = percentageChange > 0 ? "levelUp" : "levelDown";
  } else {
    percentageChange = lastMonthData.totalContracts > 0 ? 100 : 0;
    level = lastMonthData.totalContracts > 0 ? "levelUp" : "levelDown";
  }

  return {
    monthlyData,
    totalContractsLastYear: contractsLastYear.length,
    totalContractsEver,
    percentageChange,
    level,
  };
};

export const get12MonthProductSalesAnalyticsService = async (): Promise<any> => {
  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);

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

  const totalProductsEver = await prisma.contract.findMany({
    where: {
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
    ...monthNames.slice(currentMonth + 1),
    ...monthNames.slice(0, currentMonth + 1),
  ].reverse();

  const initializeMonthlyData = () => {
    return Array.from({ length: 12 }, (_, index) => ({
      month: orderedMonthNames[index],
      products: [] as {
        productId: string;
        productName: string;
        unitsSold: number;
        totalSales: number;
      }[],
      totalUnitsSold: 0,
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
      monthlyData[month].totalUnitsSold += unitsSold;
    });
  };

  const monthlyData = initializeMonthlyData();

  salesData.forEach((contract) => {
    const contractDate = new Date(contract.createdAt);
    const contractMonth = contractDate.getMonth();
    const yearDifference = today.getFullYear() - contractDate.getFullYear();
    const monthIndex = (currentMonth - contractMonth + 12 * yearDifference) % 12;

    updateMonthlyData(monthlyData, contract, monthIndex);
  });

  // Calculate percentage change and level for the last month
  const lastMonthData = monthlyData[0]; // Last month in the array
  const previousMonthData = monthlyData[1]; // Second last month in the array

  let percentageChange = 0;
  let level = '';

  if (previousMonthData.totalUnitsSold > 0) {
    percentageChange = ((lastMonthData.totalUnitsSold - previousMonthData.totalUnitsSold) / previousMonthData.totalUnitsSold) * 100;
    level = percentageChange > 0 ? 'levelUp' : 'levelDown';
  } else {
    percentageChange = lastMonthData.totalUnitsSold > 0 ? 100 : 0;
    level = lastMonthData.totalUnitsSold > 0 ? 'levelUp' : 'levelDown';
  }

  const totalUnitsSoldLastYear = monthlyData.reduce((sum, month) => sum + month.totalUnitsSold, 0);
  const totalUnitsSoldEver = totalProductsEver.reduce((sum, contract) => {
    const products = typeof contract.products === "string" ? JSON.parse(contract.products) : contract.products;
    return sum + products.reduce((productSum: number, product: any) => productSum + product.qty, 0);
  }, 0);

  return {
    monthlyData,
    totalUnitsSoldLastYear,
    totalUnitsSoldEver,
    percentageChange,
    level,
  };
};

export async function getCategoryAnalyticsService() {
  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);

  // 1. Barcha kategoriyalarni olish
  const categories = await prisma.categorie.findMany();

  // 2. `approved` statusidagi barcha contractlarni olish
  const approvedContracts = await prisma.contract.findMany({
    where: {
      status: 'approved',
      createdAt: {
        gte: lastYear,
      },
    },
  });

  // Initialize category data
  const categoryData = categories.map(category => ({
    id: category.id,
    name: category.name_uz,
    totalSold: 0,
  }));

  // 3. Har bir contract'dagi mahsulotlar bo'yicha hisoblash
  approvedContracts.forEach((contract) => {
    const products = contract.products as Array<{ categoryId: string, qty: number }>;
    products.forEach((product) => {
      const category = categoryData.find(category => category.id === product.categoryId);
      if (category) {
        category.totalSold += product.qty;
      }
    });
  });

  return categoryData;
}

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
