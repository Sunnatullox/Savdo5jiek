import { ICategorie } from "./categorie.type";

export interface IProduct {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  price: number;
  delivery_price: number;
  discount: number;
  image: string[];
  stock: number;
  quantity: number;
  status: boolean;
  unit_uz: string;
  unit_ru: string;
  unit_en: string;
  createdAt: Date;
  updatedAt: Date;
  category: ICategorie;
  categoryId: string;
}




