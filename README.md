# Movie Reservation System – Server

Backend service for a Movie Reservation System that manages movies, showtimes, seats, and bookings with concurrency-safe seat locking.

---

## Features

- User authentication and authorization (User & Admin roles)
- Movie, theater, and showtime management
- Real-time seat availability handling
- Transactional booking logic to prevent double bookings
- Booking history and reservation management
- Role-based access control for admin operations
- Clean and scalable REST API architecture

---

##  Tech Stack

- Node.js
- Express.js
- PostgreSQL
- REST APIs
- JWT Authentication

---


---

## Authentication

- Users can register and log in using email and password
- JWT token is issued on successful login
- Protected routes require a valid JWT
- Admin-only routes are secured using role-based middleware

---

## Booking Logic

- Seat availability is checked inside a database transaction
- Seats are locked during booking to avoid race conditions
- If booking fails, the transaction is rolled back
- Ensures no double booking during concurrent requests

---

## API Endpoints (Sample)

### Auth

POST /api/auth/register
POST /api/auth/login

### Movies & Shows

GET /api/movies
GET /api/movies/:id
POST /api/admin/movies
POST /api/admin/shows


### Seats & Bookings

GET /api/shows/:id/seats
POST /api/bookings
GET /api/bookings/history


---

## Error Handling

- Centralized error handling middleware
- Request validation for all APIs
- Proper HTTP status codes and error messages

---

## Future Enhancements

- Payment gateway integration
- Redis-based caching and seat locking
- WebSocket support for real-time seat updates
- Rate limiting and security hardening
- Multi-theater and multi-city support

---
 


