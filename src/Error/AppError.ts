export class AppError extends Error {
  public status: number;
  public isOperational: boolean;

  constructor(message: string, status: number = 500) {
    super(message);
    ((this.message = message),
      (this.status = status),
      (this.isOperational = true));

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
