import type { NextFunction, Request, Response } from "express";
import * as movieService from "../services/movie.services.js";
import {
  showtimeRequesBody,
  ticketBookingRequestBody,
  updateShowtimeStatusRequestBody,
  deleteMovieRequestBody,
} from "../schema/request.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BadRequestError, NotFoundError } from "@/Error/httpErrors.js";
import type { MovieParams } from "@/types.js";

export const getMovies = asyncHandler(async (req: Request, res: Response) => {
  const Allmovies = await movieService.getAllMovieService(req.user.sub);
  return res.status(200).json({
    status: "success",
    data: Allmovies,
  });
});

export const addMovies = asyncHandler(async (req: Request, res: Response) => {
  const { movie_name } = req.body;
  await movieService.addMovies({
    movie_name,
    user_id: req.user.sub,
  });
  return res.status(200).json({
    status: "success",
  });
});

export const updateMovie = asyncHandler(
  async (req: Request<MovieParams>, res: Response) => {
    const id = req.params.id;
    if (!id) {
      throw new BadRequestError("Movie ID is required");
    }
    const existingMovie = await movieService.getMovieById(id);
    if (!existingMovie) {
      throw new NotFoundError(`Movie does not exist for this id:${id}`);
    }

    const { movie_name } = req.body;
    const updatedMovie = await movieService.updateMovie(id, movie_name);
    return res.status(200).json({
      status: "success",
      data: updatedMovie,
    });
  },
);

export const deleteMovie = asyncHandler(
  async (req: Request<MovieParams>, res: Response) => {
    const movieId = req.params.id;
    if (!movieId) {
      throw new BadRequestError("Movie ID is required");
    }
    const existingMovie = await movieService.getMovieById(movieId);
    if (!existingMovie) {
      throw new NotFoundError(`Movie does not exist for this id:${movieId}`);
    }
    await movieService.deleteMovie(movieId);
    return res.status(200).json({
      status: "success",
    });
  },
);

export const addMovieHalls = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, row, seatsPerRow } = req.body;

    await movieService.createMovieHall({ name, row, seatsPerRow });
    return res.status(200).json({ status: "success" });
  },
);

export const addMovieShowtimes = asyncHandler(
  async (req: Request, res: Response) => {
    const body = showtimeRequesBody.parse(req.body);
    const movieId = body.movie_id;
    const existingMovie = await movieService.getMovieById(movieId);
    if (!existingMovie) {
      throw new NotFoundError(`Movie does not exist for this id:${movieId}`);
    }
    await movieService.createShowtimes(body);
    return res.status(200).json({ status: "success" });
  },
);

export const getShowtimes = asyncHandler(
  async (req: Request, res: Response) => {
    const showtimes = await movieService.getAllShowtimes();

    return res.status(200).json({
      status: "success",
      data: showtimes,
    });
  },
);

export const bookMovieTickets = asyncHandler(
  async (req: Request, res: Response) => {
    const { seat_ids, showtime_id } = ticketBookingRequestBody.parse(req.body);
    const userId = req.user.sub;
    await movieService.bookingMovieTicket(seat_ids, showtime_id, userId);
    return res.status(201).json({ status: "success" });
  },
);

export const updateShowtime = asyncHandler(
  async (req: Request, res: Response) => {
    const showtimeRequestData = updateShowtimeStatusRequestBody.parse(req.body);
    await movieService.updateShowtimeService(showtimeRequestData);
    return res.status(200).json({ status: "success" });
  },
);

export const deleteShowtimes = asyncHandler(
  async (req: Request, res: Response) => {
    const { showtime_id } = updateShowtimeStatusRequestBody.parse(req.body);
    await movieService.removeShowtime(showtime_id);
  },
);

export const getMovieShowtime = asyncHandler(
  async (req: Request, res: Response) => {
    const { movie_id } = req.body;
    const movieShowtimes =
      await movieService.getMovieShowtimesService(movie_id);
    return res.status(200).json({ status: "success", data: movieShowtimes });
  },
);
