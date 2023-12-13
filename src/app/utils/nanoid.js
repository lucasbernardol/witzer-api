import { customAlphabet } from 'nanoid';
import dictionary from 'nanoid-dictionary';

import constants from '../../common/constants/nanoid.js';

const alphabet = dictionary.alphanumeric;

const nanoid = customAlphabet(alphabet, constants.length);

export { constants, alphabet, nanoid };
