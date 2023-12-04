import HttpError from 'http-errors';

export const notFoundError = () => (_request, _response, next) => {
  return next(new HttpError.NotFound('Not found!'));
};
