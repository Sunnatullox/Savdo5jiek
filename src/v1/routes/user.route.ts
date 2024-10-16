import { Router } from "express";
import * as usercontroller from "../controllers/user.controller";
import {
  isAdministrator,
  isAuthenticatedAdminstrator,
  isAuthenticatedUser,
} from "../middleware/auth";
import { Role } from "../types/adminstrator.type";

const router = Router();

router.post("/login", usercontroller.login);
router.get("/logout", usercontroller.logout);
router.get("/get-me-user", isAuthenticatedUser, usercontroller.getUser);
router.get(
  "/get-user-id-by-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  usercontroller.getUserByIdByAdmin
);
router.patch(
  "/update-user-data",
  isAuthenticatedUser,
  usercontroller.updateUserData
);
router.get(
  "/get-all-users-by-admin",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  usercontroller.getAllUsersByAdmin
);
router.delete(
  "/delete-user-by-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  usercontroller.deleteUserByAdmin
);

export default router;
