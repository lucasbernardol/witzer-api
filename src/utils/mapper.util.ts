import type { LinkTypes } from '../models/interfaces/link-model.interface';

export type MapperFunction = (link: LinkTypes) => Partial<LinkTypes>;

export const mapper: MapperFunction = ({ href, hash, slug }) => {
  return {
    href,
    slug,
    hash,
  };
};
