import prisma from "../config/db";
import { Prisma } from "@prisma/client";

export async function createCategory(
  data: Prisma.CategorieCreateInput
) {
  return await prisma.categorie.create({
    data,
  });
}

export async function getCategories() {
  return await prisma.categorie.findMany();
}

export async function getCategoriesByAdminService() {
  return await prisma.categorie.findMany({
    select: {
      id: true,
      name_uz: true,
      name_slug_uz: true,
      createdAt: true,
      _count: {
        select: {
          Product: true, // This will count the number of products in each category
        },
      },
    },
  });
}


export async function getCategoryById(id: string) {
  return await prisma.categorie.findUnique({
    where: { id },
  });
}

export async function updateCategoryById(
  id: string,
  data: Prisma.CategorieUpdateInput
) {
  return await prisma.categorie.update({
    where: { id },
    data,
  });
}

export async function deleteCategoryById(id: string) {
  await prisma.product.deleteMany({
    where: {
      categoryId: id,
    },
  });
  return await prisma.categorie.delete({
    where: { id },
  });
}
