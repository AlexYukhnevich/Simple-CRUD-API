import HttpException from 'src/errors/http-exception.error';

export class InternalServerError extends HttpException {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}
