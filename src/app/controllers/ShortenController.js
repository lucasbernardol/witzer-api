import { StatusCodes } from 'http-status-codes';

import { Shorten } from '../models/Shorten.js';

export default class ShortenController {
  async create(request, response) {
    try {
      const { href } = request.body;

      const instance = await Shorten.create({
        href,
      });

      const plain = {
        href: instance.href,
        hash: instance.hash,
      };

      return response.status(StatusCodes.CREATED).json(plain);
    } catch (error) {
      return next(error);
    }
  }

  async resolving(request, response) {
    const { hash } = request.params;

    const format = request.query?.format ?? 'json';

    const shorten = await Shorten.findOne({ hash })
      .select(['_id', 'href', 'hash'])
      .lean()
      .exec();

    console.log(shorten);

    if (!shorten) {
      return response.json({ message: 'Short not found' });
    }

    // Set status code
    response.status(StatusCodes.OK); // 200

    if (format?.toLowerCase() === 'raw') {
      return response.type('text').send(shorten.href);
    }

    return response.status(StatusCodes.OK).json({ href: shorten.href });
  }
}
