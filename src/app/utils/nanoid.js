import { customAlphabet } from 'nanoid';
import dictionary from 'nanoid-dictionary';

import constants from '../../common/constants/nanoid.js';

export const alphabet = dictionary.alphanumeric;

export const nanoid = customAlphabet(alphabet, constants.length);
