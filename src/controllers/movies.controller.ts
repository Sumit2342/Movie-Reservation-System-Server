import type { NextFunction, Request, Response } from "express";
import * as movieService from "../services/movie.services.js";
import {
  showtimeRequesBody,
  ticketBookingRequestBody,
  updateShowtimeStatusRequestBody,
  deleteMovieRequestBody,
} from "../schema/request.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

export const updateMovie = asyncHandler(async (req: Request, res: Response) => {
  const { id, movie_name } = req.body;
  const updatedMovie = await movieService.updateMovie(id, movie_name);
  return res.status(200).json({
    status: "success",
    data: updatedMovie,
  });
});

export const deleteMovie = asyncHandler(async (req: Request, res: Response) => {
  const { movie_id } = deleteMovieRequestBody.parse(req.body);
  await movieService.deleteMovie(movie_id);
  return res.status(200).json({
    status: "success",
  });
});

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
