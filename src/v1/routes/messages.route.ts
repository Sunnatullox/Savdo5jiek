import { Router } from "express";
import {
  isAdministrator,
  isAuthenticatedAdminstrator,
  isAuthenticatedUser,
} from "../middleware/auth";
import * as messagesController from "../controllers/messages.controller";
import { Role } from "../types/adminstrator.type";
const router = Router();

router.post(
  "/send-message-user",
  isAuthenticatedUser,
  messagesController.sendMessageUser
);
router.post(
  "/send-message-admin",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  messagesController.sendMessageAdmin
);
router.get(
  "/get-messages-user/:contractId",
  isAuthenticatedUser,
  messagesController.getMessagesUserByContractId
);
router.get(
  "/get-messages-admin/:contractId",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  messagesController.getMessagesAdminByContractId
);
router.get(
  "/get-notification-user",
  isAuthenticatedUser,
  messagesController.getNotificationUser
);
router.get(
  "/get-notification-admin",
  isAuthenticatedAdminstrator,
  isAdministrator(Role.ADMIN),
  messagesController.getNotificationAdmin
);

export default router;
