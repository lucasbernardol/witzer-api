import { customAlphabet } from 'nanoid/async';
import { alphanumeric } from 'nanoid-dictionary';

import { NANOID_SPECIAL_CHARACTERS } from '@constants/string.constants';
import { NANOID_HASH_LENGTH } from '@constants/numbers.constants';

const alphabet = alphanumeric.concat(NANOID_SPECIAL_CHARACTERS);

export const nanoid = customAlphabet(alphabet, NANOID_HASH_LENGTH);
