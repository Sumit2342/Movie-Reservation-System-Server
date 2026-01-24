import { prisma } from "../config/db.js";

type Movie = {};
export const getAllMovieService = async (user_id: string) => {
  const allMovies = await prisma.movies.findMany({
    where: { user_id: user_id },
  });
  if (!allMovies) throw new Error("No movies found for this user");

  return allMovies;
};

export const addMovies = async (movie: any) => {
  const addMovie = await prisma.movies.create({ data: movie });
  return addMovie;
};

export const updateMovie = async (id: string, movieName: string) => {
  const updatedMovie = await prisma.movies.update({
    where: { id: id },
    data: { movie_name: movieName },
  });

  return updateMovie;
};

export const deleteMovie = async (id: string) => {
  await prisma.movies.delete({ where: { id: id } });
};

export const createMovieHall = async (hall: any) => {
  await prisma.MovieHalls.create({ data: hall });
};
