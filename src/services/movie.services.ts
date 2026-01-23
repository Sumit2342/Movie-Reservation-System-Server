import { prisma } from "../config/db.js";

type Movie = {};
export const getAllMovieService = async (user_id: number) => {
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

export const updateMovie = async (id: number, movieName: string) => {
  const updatedMovie = await prisma.movies.update({
    where: { id: id },
    data: { movie_name: movieName },
  });

  return updateMovie;
};

export const deleteMovie = async (id: number) => {
  await prisma.movies.delete({ where: { id: id } });
};
