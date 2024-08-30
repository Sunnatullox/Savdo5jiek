import { IProduct } from "./product.type";


export type CategorieOrderByWithRelationInput = {
  createdAt?: "asc" | "desc";
  updatedAt?: "asc" | "desc";
};

export interface ICategorie {
  id: string;
  name_uz: string;
  name_slug_uz: string;
  name_ru: string;
  name_slug_ru: string;
  name_en: string;
  name_slug_en: string;
  createdAt: Date;
  updatedAt: Date;
  Product: IProduct[];
}


