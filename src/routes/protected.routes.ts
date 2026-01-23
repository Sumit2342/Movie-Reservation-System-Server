import { Router } from "express";
import * as profileController from "../controllers/profile.controller.js";
import * as movieController from "../controllers/movies.controller.js";
import auth from "../authenticate.js";

const router = Router();

router.get("/profile", auth, profileController.profile);
router.get("/allMovies", auth, movieController.getMovies);
router.post("/addMovie", auth, movieController.addMovies);
router.post("/updateMovie", auth, movieController.updateMovie);
router.post("/deleteMovie", auth, movieController.deleteMovie);
export default router;
