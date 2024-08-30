import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../middleware/ErrorHandler";
import slugify from "slugify";
import {
  createCategory,
  getCategories as categiriesService,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} from "../services/category.service";

export const createCategorieAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name_uz, name_ru, name_en } = req.body;
      if (!name_uz) {
        return next(new ErrorHandler("Name_uz is required", 400));
      }
      const name_slug_uz = slugify(name_uz, { lower: true });
      const name_slug_ru = name_ru
        ? slugify(name_ru, { lower: true })
        : name_slug_uz;
      const name_slug_en = name_en
        ? slugify(name_en, { lower: true })
        : name_slug_uz;

      const category = await createCategory({
        name_uz: name_uz,
        name_slug_uz: name_slug_uz,
        name_ru: name_ru || name_uz,
        name_slug_ru: name_slug_ru,
        name_en: name_en || name_uz,
        name_slug_en: name_slug_en,
      });

      res.status(201).json({
        success: true,
        message: "Category created",
        category,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await categiriesService();
      res.status(200).json({
        success: true,
        message: "Categories Successfully",
        categories,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const category = await getCategoryById(id);
      if (!category) {
        return next(new ErrorHandler("Category not found", 404));
      }
      res.status(200).json({
        success: true,
        message: "Category fetched",
        category,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name_uz, name_ru, name_en } = req.body;
      if (!name_uz) {
        return next(new ErrorHandler("Name_uz is required", 400));
      }
      const category = await updateCategoryById(id, {
        name_uz: name_uz || "",
        name_ru: name_ru || name_uz,
        name_en: name_en || name_uz,
      });
      if (!category) {
        return next(new ErrorHandler("Category not found", 404));
      }
      res.status(200).json({
        success: true,
        message: "Category updated",
        category,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await deleteCategoryById(id);
      if (!category) {
        return next(new ErrorHandler("Category not found", 404));
      }
      res.status(200).json({
        success: true,
        message: "Category deleted",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);