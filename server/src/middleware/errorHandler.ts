import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../router/httpError";

/**
 * Global Express error-handling middleware.
 *
 * @remarks
 * Converts {@link HttpError} instances into structured responses and falls back to 500.
 */
export function ErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  if (err instanceof HttpError) {
    console.log(err.message);
    res.status(err.statusCode).send({ error: err.message });
  } else {
    console.log(err);
    res.status(500).send();
  }
}
