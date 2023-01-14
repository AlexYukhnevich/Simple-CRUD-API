/* eslint-disable no-unused-vars */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export enum MimeType {
  JSON = 'json',
}

export const MIME_TYPES = {
  [MimeType.JSON]: 'application/json',
};

export const responseMap: { [key in HttpStatus]: string } = {
  [HttpStatus.OK]: 'Success',
  [HttpStatus.CREATED]: 'Created',
  [HttpStatus.NO_CONTENT]: 'No Content',
  [HttpStatus.BAD_REQUEST]: 'Bad Request',
  [HttpStatus.NOT_FOUND]: 'Not Found',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
};
