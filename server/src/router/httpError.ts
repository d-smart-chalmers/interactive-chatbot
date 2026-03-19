export class HttpError extends Error {
  /**
   * Creates a new HttpError.
   * @param message The error message.
   * @param statusCode The HTTP status code.
   */
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "HttpError";
  }
}
