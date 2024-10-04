import path from "path";
import fs from "fs";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../middleware/ErrorHandler";
import {
  createProductService,
  deleteProductService,
  getProductByIdService,
  getProductsByAdminService,
  getProductsService,
  updateProductService,
} from "../services/product.service";
import prisma from "../config/db";

export const createProductByAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name_uz,
        name_ru,
        name_en,
        description_uz,
        description_ru,
        description_en,
        price,
        discount,
        categoryId,
        stock,
        unit_uz,
        unit_ru,
        unit_en,
        delivery_price,
      } = req.body;

      if (!name_uz || !description_uz || !price || !categoryId || !unit_uz || !stock) {
        return next(new ErrorHandler("Name, description, price, category, unit and stock are required", 400));
      }

      if (stock && stock <= 0) {
        return next(new ErrorHandler("Stock must be greater than 0", 400));
      }

      const images = req.files as Express.Multer.File[];
      if (!images || images.length <= 0 || images.length > 5) {
        return next(new ErrorHandler("Image must be 5 or less", 400));
      }

      const imagesPath = images.map(file => `${req.protocol}://${req.get("host")}/public/imgs/${file.filename}`);

      const createProduct = await createProductService({
        name_uz,
        name_ru: name_ru || name_uz,
        name_en: name_en || name_uz,
        description_uz,
        description_ru: description_ru || description_uz,
        description_en: description_en || description_uz,
        price: Number(price),
        discount: Number(discount),
        image: imagesPath,
        stock: Number(stock),
        unit_uz,
        unit_ru: unit_ru || unit_uz,
        unit_en: unit_en || unit_uz,
        categoryId,
        status: true,
        delivery_price: Number(delivery_price)
      });

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: createProduct,
      });
    } catch (error: any) {
      console.log("Error creating product", error);
      return next(new ErrorHandler(`Error creating product: ${error.message}`, 500));
    }
  }
);

export const getProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const categorie = (req.query.categorie as string) || "";
      const total = await prisma.product.count();
      const products = await getProductsService(page, limit, search, categorie);

      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products,
        pagination: {
          page: page,
          limit: limit,
          total: total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error(`Error getting products: ${error.message}`); // Log the error
      return next(
        new ErrorHandler(`Error getting products: ${error.message}`, error.statusCode || 500)
      );
    }
  }
);

export const getProductsByAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await getProductsByAdminService();
      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(`Error getting products: ${error.message}`, 500)
      );
    }
  }
);


export const getProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("Product id is required", 400));
      }
      const product = await getProductByIdService(id);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
      res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data: product,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(`Error getting product: ${error.message}`, 500)
      );
    }
  }
);

export const updateProductByAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("Product id is required", 400));
      }

      const {
        name_uz,
        name_ru,
        name_en,
        description_uz,
        description_ru,
        description_en,
        price,
        discount,
        categoryId,
        stock,
        unit_uz,
        unit_ru,
        unit_en,
        delivery_price,
        oldImages=[]
      } = req.body;

      prisma.$transaction(async (tx) => {
      const images = req.files as Express.Multer.File[];
      let imagesPath:string[] = []

      if(images?.length > 0){
        imagesPath =  await Promise.all(images.map(async (file) => `${req.protocol}://${req.get("host")}/public/imgs/${file.filename}`))
      }

      const findProduct = await getProductByIdService(id);
      if (!findProduct) {
        return next(new ErrorHandler("Product not found", 404));
      }

      if (imagesPath.length > 0 || oldImages.length > 0) {
        const oldImgFindAndDelete = findProduct.image.filter(
          (oldImg) => !oldImages.includes(oldImg)
        );
        if (oldImgFindAndDelete.length > 0) {
          for (const oldImgDelete of oldImgFindAndDelete) {
            if (oldImgDelete === undefined) {
              continue;
            }
            const fileName = oldImgDelete.split("public/imgs/")[1];
            const filePath = path.join(__dirname, `../public/imgs/${fileName}`);
            fs.unlink(filePath, err => {
              if (err && err.code !== 'ENOENT') {
                throw err;
              }
            });
          }
        }
      }

      const product_img =
          typeof oldImages === "string"
            ? [oldImages, ...(imagesPath || [])]
            : [...(oldImages || []), ...(imagesPath || [])];

      const updatedProduct = await updateProductService(tx, id, {
        name_uz: name_uz || findProduct.name_uz,
        name_ru: name_ru || findProduct.name_ru,
        name_en: name_en || findProduct.name_en,
        description_uz: description_uz || findProduct.description_uz,
        description_ru: description_ru || findProduct.description_ru,
        description_en: description_en || findProduct.description_en,
        price: price !== undefined ? Number(price) : findProduct.price,
        discount: discount !== undefined ? Number(discount) : findProduct.discount,
        categoryId: categoryId || findProduct.categoryId,
        image: product_img,
        stock: stock !== undefined ? Number(stock) : findProduct.stock,
        unit_uz: unit_uz || findProduct.unit_uz,
        unit_ru: unit_ru || findProduct.unit_ru,
        unit_en: unit_en || findProduct.unit_en,
        delivery_price: delivery_price !== undefined ? Number(delivery_price) : findProduct.delivery_price
      });

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
          data: updatedProduct,
        });
      }); 
    } catch (error: any) {
      console.log("Error updating product", error);
      return next(new ErrorHandler(`Error updating product: ${error.message}`, 500));
    }
  }
);

export const deleteProductByAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("Product id is required", 400));
      }

      const findProduct = await getProductByIdService(id);
      if (!findProduct) {
        return next(new ErrorHandler("Product not found", 404));
      }

      if (findProduct.image.length > 0) {
        const deleteImagePromises = findProduct.image.map(image => {
          const fileName = image.split("public/imgs/")[1];
          const filePath = path.join(__dirname, `../public/imgs/${fileName}`);
          return fs.promises.unlink(filePath).catch(err => {
          if(err && err.code !== 'ENOENT'){
            throw err;
          }
          });
        });
        await Promise.all(deleteImagePromises);
      }

      await deleteProductService(id);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(`Error deleting product: ${error.message}`, 500));
    }
  }
);
