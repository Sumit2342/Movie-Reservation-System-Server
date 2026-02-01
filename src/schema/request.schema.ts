import * as z from "zod";

export const deleteMovieRequestBody = z.object({
  movie_id: z.string().uuid(),
});

export const showtimeRequesBody = z
  .object({
    movie_id: z.string(),
    hall_id: z.string(),
    start_time: z.coerce.date(),
    end_time: z.coerce.date(),
    price: z.number().positive(),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: "End time must be after start time",
    path: ["end_time"],
  });

export const ticketBookingRequestBody = z.object({
  seat_ids: z
    .array(z.string().uuid())
    .min(1, "At least one seat must be selected"),
  showtime_id: z.string(),
});

export const updateShowtimeStatusRequestBody = z.object({
  showtime_id: z.string().uuid(),
  movie_id: z.string().optional(),
  status: z.enum(["ONGOING", "COMPLETED", "CANCELLED"]),
});
