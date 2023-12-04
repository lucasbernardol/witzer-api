const UNKNOWN_AGENT = 'unknown';

export const userAgent = () => (request, response, next) => {
  try {
    request.userAgent = request.get('user-agent') ?? UNKNOWN_AGENT;

    return next();
  } catch (error) {
    return next(error);
  }
};
