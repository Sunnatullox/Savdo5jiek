import { Router } from "express";
import * as usercontroller from "../controllers/user.controller";
import { isAuthenticatedUser } from "../middleware/auth";


const router = Router()

router.post("/login", usercontroller.login)
router.get("/logout", usercontroller.logout)
router.get("/get-user", isAuthenticatedUser, usercontroller.getUser)
router.patch("/update-user-data", isAuthenticatedUser, usercontroller.updateUserData)





export default router