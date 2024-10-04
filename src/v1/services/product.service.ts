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
  } catch (error:any) {
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
  } catch (error:any) {
    console.error(`Error fetching product by ID: ${error.message}`);
    throw new ErrorHandler("Error fetching product", 500);
  }
}

export async function updateProductService(prisma: PrismaClient, id: string, data: Partial<Product>) {
  return await prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProductService(id: string) {
  return await prisma.product.delete({
    where: { id },
  });
}
