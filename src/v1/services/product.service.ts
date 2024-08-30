import prisma from "../config/db";
import { Product } from "@prisma/client";
import ErrorHandler from "../middleware/ErrorHandler";

export async function createProductService(
  data: Omit<Product, "id" | "createdAt" | "updatedAt">
) {
  return await prisma.product.create({
    data,
  });
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

export async function getProductByIdService(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
  if(!product) {
    throw new ErrorHandler("Product not found", 404);
  }
  return product;
}


export async function updateProductService(id: string, data: Partial<Product>) {
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
