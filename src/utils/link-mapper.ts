import type { LinkTypes } from '../models/link.model';

type LinkMappperFunction = (link: LinkTypes) => Partial<LinkTypes>;

export const linkMapper: LinkMappperFunction = ({ href, hash }) => {
  return {
    href,
    hash,
  };
};
