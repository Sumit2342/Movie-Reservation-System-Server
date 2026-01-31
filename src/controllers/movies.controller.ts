import type { Request, Response } from "express";
import * as movieService from "../services/movie.services.js";
import {
  showtimeRequesBody,
  ticketBookingRequestBody,
} from "../schema/request.schema.js";

export const getMovies = async (req: Request, res: Response) => {
  try {
    const Allmovies = await movieService.getAllMovieService(req.user.sub);
    return res.status(200).json({
      status: "success",
      data: Allmovies,
    });
  } catch (error: any) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

export const addMovies = async (req: Request, res: Response) => {
  try {
    const { movie_name } = req.body;
    await movieService.addMovies({
      movie_name,
      user_id: req.user.sub,
    });
    return res.status(200).json({
      status: "success",
    });
  } catch (error: any) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const { id, movie_name } = req.body;
    const updatedMovie = await movieService.updateMovie(id, movie_name);
    return res.status(200).json({
      status: "success",
      data: updatedMovie,
    });
  } catch (error) {}
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await movieService.deleteMovie(id);
    return res.status(200).json({
      status: "sucess",
    });
  } catch (error: any) {
    res.status(500).json({ status: "fail", error: error });
  }
};

export const addMovieHalls = async (req: Request, res: Response) => {
  try {
    const { name, row, seatsPerRow } = req.body;

    await movieService.createMovieHall({ name, row, seatsPerRow });
    return res.status(200).json({ status: "success" });
  } catch (error: any) {
    res.status(500).json({ status: "fail", error: error.message });
  }
};

export const addMovieShowtimes = async (req: Request, res: Response) => {
  try {
    const body = showtimeRequesBody.parse(req.body);
    await movieService.createShowtimes(body);
    return res.status(200).json({ status: "success" });
  } catch (error: any) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const getShowtimes = async (req: Request, res: Response) => {
  try {
    const showtimes = await movieService.getAllShowtimes();

    return res.status(200).json({
      status: "success",
      data: showtimes,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const bookMovieTickets = async (req: Request, res: Response) => {
  try {
    const { seat_ids, showtime_id } = ticketBookingRequestBody.parse(req.body);
    const userId = req.user.sub;
    await movieService.bookingMovieTicket(seat_ids, showtime_id, userId);
    return res.status(201).json({ status: "success" });
  } catch (error: any) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
