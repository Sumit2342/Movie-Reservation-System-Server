import { Router } from "express";
import * as AuthController from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/refresh", AuthController.refresh);

export default router;
