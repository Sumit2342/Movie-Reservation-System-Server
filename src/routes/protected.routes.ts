import { Router } from "express";
import * as ProfileController from "../controllers/profile.controller.js";
import auth from "../authenticate.js";

const router = Router();

router.get("/profile", auth, ProfileController.profile);

export default router;
