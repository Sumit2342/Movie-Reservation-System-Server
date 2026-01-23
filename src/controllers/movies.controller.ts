import type { Request, Response } from "express";
import * as movieService from "../services/movie.services.js";

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
      user_id: req.user.id,
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
    res.status(500).json({ status: "success", error: error });
  }
};
