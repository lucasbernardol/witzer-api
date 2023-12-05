import { Url } from './types/url.js';

export const urlSchema = () => ({
  href: Url(),
});
