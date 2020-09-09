export class InternalServerError extends Error {
  statusCode = 500;
  constructor(message: string) {
    super(message);
    Object.defineProperty(this, 'message', { enumerable: true });
  }
}
