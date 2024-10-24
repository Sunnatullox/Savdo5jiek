import { Router } from "express";
import * as productController from "../controllers/product.controller";
import {
  isAdministrator,
  isAuthenticatedAdminstrator,
} from "../middleware/auth";
import { Role } from "../types/adminstrator.type";
import { imgUpload } from "../utils/fileUpload";

const router = Router();

router.post(
  "/create-product-by-admin",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  imgUpload.array("images", 5),
  productController.createProductByAdmin
);

router.get(
  "/get-products",
  productController.getProducts
);

router.get(
  "/get-top-products",
  productController.getTopProducts
);

router.get(
  "/get-products-discount",
  productController.getProductsDiscount
);

router.get(
  "/get-new-products",
  productController.getNewProducts
);

router.get(
  "/get-products-by-admin",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  productController.getProductsByAdmin
);

router.get(
  "/get-product/:id",
  productController.getProductById
);

router.put(
  "/update-product-by-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  imgUpload.array("images", 5),
  productController.updateProductByAdmin
);

router.put(
  "/update-product-status-by-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  productController.updateProductStatusByAdmin
);

router.delete(
  "/delete-product-by-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  productController.deleteProductByAdmin
);

export default router;
