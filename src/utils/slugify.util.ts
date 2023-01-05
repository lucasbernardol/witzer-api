import slugify from 'slugify';

type SlugifiedFunction = (slug: string) => string;

export const slugified: SlugifiedFunction = (slug) => {
  return slugify(slug, {
    replacement: '-',
    lower: true,
    strict: true,
    trim: true,
    //remove: /[]/gi; // Replce special chars using Joi/input validation.
    //locale: 'en'
  });
};
