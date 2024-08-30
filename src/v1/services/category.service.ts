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
  return await prisma.categorie.delete({
    where: { id },
  });
}
