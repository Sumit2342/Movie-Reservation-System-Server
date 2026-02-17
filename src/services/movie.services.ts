import { prisma } from "../config/db.js";
import { BadRequestError } from "../Error/httpErrors.js";

type ShowtimeData = {
  showtime_id: string;
  movie_id?: string | undefined;
  status: "ONGOING" | "COMPLETED" | "CANCELLED";
};
export const getAllMovieService = async (user_id: string) => {
  const allMovies = await prisma.movies.findMany({
    where: { user_id: user_id },
  });
  if (!allMovies) throw new Error("No movies found for this user");

  return allMovies;
};

export const getMovieById = async (movieId: string) => {
  const movie = await prisma.movies.findUnique({ where: { id: movieId } });
  return movie;
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

export const createMovieHall = async (hallData: any) => {
  const { name, row, seatsPerRow } = hallData;
  const seats: Array<{ hall_id: string; row: string; seat_number: string }> =
    [];
  return prisma.$transaction(async (tx) => {
    const hall = await tx.movieHalls.create({ data: { name } });
    for (let r = 0; r < row; r++) {
      const rowChar = String.fromCharCode(65 + r);
      for (let s = 1; s <= seatsPerRow; s++) {
        seats.push({
          hall_id: hall.id,
          row: rowChar,
          seat_number: s.toString(),
        });
      }
    }
    await tx.seats.createMany({ data: seats });
  });
};

export const createShowtimes = async (showtimeData: any) => {
  return prisma.$transaction(async (tx) => {
    if (showtimeData.start_time >= showtimeData.end_time) {
      throw new BadRequestError("Start time must be before end time");
    }

    const overlapShowtime = await tx.showtimes.findFirst({
      where: {
        hall_id: showtimeData.hall_id,
        start_time: { lt: showtimeData.end_time },
        end_time: { gt: showtimeData.start_time },
      },
    });

    if (overlapShowtime) {
      throw new BadRequestError("Showtime already exists with this timing");
    }

    const showtime = await tx.showtimes.create({
      data: showtimeData,
    });

    const seats = await tx.seats.findMany({
      where: { hall_id: showtime.hall_id },
    });

    const showTimeSeatsData = seats.map((seat) => ({
      showtime_id: showtime.id,
      seat_id: seat.id,
      status: "AVAILABLE" as const,
      locked_until: null,
    }));

    await tx.showtimeSeats.createMany({
      data: showTimeSeatsData,
      skipDuplicates: true,
    });

    return showtime;
  });
};

export const getAllShowtimes = async () => {
  const now = new Date();

  return prisma.showtimes.findMany({
    where: {
      status: "UPCOMING",
      start_time: { gte: now },
    },
    orderBy: {
      start_time: "asc",
    },
    include: {
      movie: {
        select: {
          id: true,
          movie_name: true,
          image_url: true,
        },
      },
      hall: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const bookingMovieTicket = async (
  seat_ids: string[],
  showtime_id: string,
  userId: string,
) => {
  return await prisma.$transaction(async (tx) => {
    const resultSeats = await tx.showtimeSeats.updateMany({
      where: { id: { in: seat_ids }, showtime_id, status: "AVAILABLE" },
      data: {
        status: "LOCKED",
        locked_until: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    if (resultSeats.count !== seat_ids.length)
      throw new BadRequestError("Seat is no longer available");

    const booking = await tx.bookings.create({
      data: { user_id: userId, showtime_id: showtime_id, status: "PENDING" },
    });

    const bookingSeatsData = seat_ids.map((seatId) => ({
      booking_id: booking.id,
      showtime_seat_id: seatId,
    }));

    console.log(bookingSeatsData);

    await tx.booking_seats.createMany({
      data: bookingSeatsData,
    });
    return booking;
  });
};

export const updateShowtimeService = async (showtimeData: ShowtimeData) => {
  const { showtime_id, status } = showtimeData;
  const updatedShowtime = await prisma.$transaction(async (tx) => {
    return tx.showtimes.update({
      where: { id: showtime_id },
      data: { status: status },
    });
  });
  return updatedShowtime;
};

export const removeShowtime = async (showtime_id: string) => {
  await prisma.showtimes.delete({ where: { id: showtime_id } });
};

export const getMovieShowtimesService = async (movie_id: string) => {
  const movieShowtimes = await prisma.showtimes.findMany({
    where: { movie_id: movie_id },
  });
  return movieShowtimes;
};
