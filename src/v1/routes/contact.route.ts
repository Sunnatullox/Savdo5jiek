import { Router } from "express";
import {
  createContact,
  deleteContactUsAdmin,
  getContactUsIsNotReadAdmin,
  getContactUsListAdmin,
  getSingleContactUsAdmin,
} from "../controllers/contact.controller";
import {
  isAdministrator,
  isAuthenticatedAdminstrator,
} from "../middleware/auth";
import { Role } from "../types/adminstrator.type";


const router = Router();

router.post("/create-contact-us", createContact);

router.get(
  "/get-contact-notification",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  getContactUsIsNotReadAdmin
);

router.get(
  "/get-contact-list-by-admin",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  getContactUsListAdmin
);

router.get(
  "/get-single-contact-by-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  getSingleContactUsAdmin
);

router.delete(
  "/delete-contact-by-admin/:id",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  deleteContactUsAdmin
);

export default router;
