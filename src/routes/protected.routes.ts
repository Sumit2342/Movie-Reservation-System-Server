import { Router } from "express";
import * as profileController from "../controllers/profile.controller.js";
import * as movieController from "../controllers/movies.controller.js";
import auth from "../authenticate.js";
import { authorize } from "../middleware/authorization.js";

const router = Router();

router.get("/profile", auth, profileController.profile);
router.get("/allMovies", auth, movieController.getMovies);
router.post("/addMovie", auth, authorize(["ADMIN"]), movieController.addMovies);
router.post(
  "/updateMovie",
  auth,
  authorize(["ADMIN"]),
  movieController.updateMovie,
);
router.post(
  "/deleteMovie",
  auth,
  authorize(["ADMIN"]),
  movieController.deleteMovie,
);
router.post(
  "/addMovieHall",
  auth,
  authorize(["ADMIN"]),
  movieController.addMovieHalls,
);
router.post(
  "/create-showtime",
  auth,
  authorize(["ADMIN"]),
  movieController.addMovieShowtimes,
);

router.get("/get-upcoming-shows", auth, movieController.getShowtimes);

router.post("/book-seats", auth, movieController.bookMovieTickets);
router.put(
  "/update-showtime-status",
  auth,
  authorize(["ADMIN"]),
  movieController.updateShowtime,
);
router.delete(
  "/delete-showtime",
  auth,
  authorize(["ADMIN"]),
  movieController.deleteShowtimes,
);

router.get("/getMovieShowtime", auth, movieController.getMovieShowtime);
export default router;
