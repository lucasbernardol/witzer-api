import HttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';

export const errorHandler = () => (error, request, response, next) => {
  let exception = {
    name: 'InternalServerError',
    message: 'Internal error.',
    status: StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (HttpError.isHttpError(error)) {
    exception = {
      name: error.name,
      message: error.message,
      status: error.status,
    };
  }

  console.log(error);

  return response.status(exception.status).json(exception);
};
