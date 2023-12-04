import HttpError from 'http-errors';
import isBot from 'isbot';

export const isRobot = () => (request, response, next) => {
  try {
    const userAgent = request.get('user-agent');

    const isWebCrawlerOrBot = isBot(userAgent);

    if (isWebCrawlerOrBot) {
      throw new HttpError.BadRequest('Opps! Bot detected!');
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
