import HttpException from './http-exception.error';

export class NotFoundError extends HttpException {
  constructor(message = 'Not Found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends HttpException {
  constructor(message = 'Bad Request') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}
