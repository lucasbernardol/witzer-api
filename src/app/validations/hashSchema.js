import { NanoId } from './types/nanoid.js';

export const hashSchema = () => ({
  hash: NanoId(),
});
