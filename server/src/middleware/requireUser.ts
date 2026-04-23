import { NextFunction, type Request, type Response } from "express";

/**
 * Express middleware that ensures that there is an active session.
 *
 * @remarks
 * Sends a 400 response with an error message if the user has not joined a game.
 */
export function requireUser(req: Request, res: Response, next: NextFunction) {
  console.log("Checking for active user session...");
  console.log("Session ID:", req.sessionID);
  console.log("Session User ID:", req.session.userId);
  if (!req.session.userId) {
    res.status(400).send({ error: "Not an active user" });
    return;
  }
  next();
}
