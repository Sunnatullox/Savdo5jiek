import { Router } from "express";
import * as categoryController from "../controllers/categorie.controller";
import {
  isAdministrator,
  isAuthenticatedAdminstrator,
} from "../middleware/auth";
import { Role } from "../types/adminstrator.type";

const router = Router();

router.post(
  "/create-categorie",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  categoryController.createCategoryAdmin
);

router.get("/get-categories", categoryController.getCategories);
router.get("/get-categorie/:id", categoryController.getCategory);
router.put(
  "/update-categorie/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  categoryController.updateCategory
);
router.delete(
  "/delete-categorie/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  categoryController.deleteCategory
);

export default router;
