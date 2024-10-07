import prisma from "../config/db";
import { Product } from "@prisma/client";
import ErrorHandler from "../middleware/ErrorHandler";
import { PrismaClient } from "@prisma/client/extension";

export async function createProductService(
  data: Omit<Product, "id" | "createdAt" | "updatedAt">
) {
  try {
    return await prisma.product.create({
      data,
    });
  } catch (error: any) {
    console.error(`Error creating product: ${error.message}`);
    throw new ErrorHandler("Error creating product", 500);
  }
}

export async function getProductsService(
  page: number,
  limit: number,
  search: string,
  categorie: string
) {
  let categoryFilter = {};
  if (categorie) {
    const findCategory = await prisma.categorie.findFirst({
      where: {
        OR: [
          { name_uz: { contains: categorie } },
          { name_ru: { contains: categorie } },
          { name_en: { contains: categorie } },
          { name_slug_en: { contains: categorie } },
          { name_slug_ru: { contains: categorie } },
          { name_slug_uz: { contains: categorie } },
        ],
      },
    });
    if (!findCategory) {
      throw new ErrorHandler("Category not found", 404);
    }
    categoryFilter = { categoryId: findCategory.id };
  }

  const products = await prisma.product.findMany({
    where: {
      status: true,
      OR: [
        { name_uz: { contains: search } },
        { name_ru: { contains: search } },
        { name_en: { contains: search } },
        { description_uz: { contains: search } },
        { description_ru: { contains: search } },
        { description_en: { contains: search } },
      ],
      ...categoryFilter,
    },
    include: {
      category: true,
    },
    skip: (page - 1) * limit,
    take: limit,
  });
  return products;
}

export async function getTopProductsService() {
  // Contractlardan tasdiqlangan mahsulotlarni olish
  const approvedContracts = await prisma.contract.findMany({
    where: {
      status: "approved",
    },
    select: {
      products: true,
    },
  });

  // Mahsulotlar bo'yicha sotilgan sonini hisoblash
  const productSalesCount: Record<string, number> = {};

  console.log(approvedContracts);

  approvedContracts.forEach((contract) => {
    const products =
      typeof contract.products === "string"
        ? JSON.parse(contract.products)
        : contract.products;
    products.forEach((product: any) => {
      if (productSalesCount[product.id]) {
        productSalesCount[product.id] += product.qty;
      } else {
        productSalesCount[product.id] = product.qty;
      }
    });
  });

  // Eng ko'p sotilgan 20 ta mahsulotni topish
  const topProductIds = Object.entries(productSalesCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([productId]) => productId);

  // Topilgan mahsulotlarni ma'lumotlar bazasidan olish
  const topProducts = await prisma.product.findMany({
    where: {
      id: { in: topProductIds },
    },
    include: {
      category: true,
    },
  });

  return topProducts;
}

export async function getNewProductsService() {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const newProducts = await prisma.product.findMany({
    where: {
      createdAt: {
        gte: oneMonthAgo,
      },
    },
    include: {
      category: true,
    },
  });

  return newProducts;
}

export async function getProductsByAdminService() {
  return await prisma.product.findMany({
    include: {
      category: true,
    },
  });
}

export async function getProductByIdService(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }
    return product;
  } catch (error: any) {
    console.error(`Error fetching product by ID: ${error.message}`);
    throw new ErrorHandler("Error fetching product", 500);
  }
}

export async function updateProductService(
  prisma: PrismaClient,
  id: string,
  data: Partial<Product>
) {
  return await prisma.product.update({
    where: { id },
    data,
  });
}

export async function updateProductStatusService(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) {
    throw new ErrorHandler("Product not found", 404);
  }
  return await prisma.product.update({
    where: { id },
    data: { status: !product.status },
  });
}

export async function deleteProductService(id: string) {
  return await prisma.product.delete({
    where: { id },
  });
}
