import type { LinkTypes } from '../models/link.model';

type MapperFunction = (link: LinkTypes) => Partial<LinkTypes>;

export const mapper: MapperFunction = ({ href, hash }) => {
  return {
    href,
    hash,
  };
};
