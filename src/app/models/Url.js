import mongoose, { Schema } from 'mongoose';

import { customAlphabet } from 'nanoid';
import dictionary from 'nanoid-dictionary';

import constants from '../../constants/nanoid.js';

const nanoid = customAlphabet(dictionary.alphanumeric, constants.LENGTH); // 12

const schema = new Schema(
  {
    href: {
      type: String,
      require: true,
      maxLength: 2048,
      trim: true,
    },

    hash: {
      type: String,
      require: true,
      maxLength: 12,
      unique: true,
      default: () => nanoid(),
    },

    redirectings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Url = mongoose.model('Url', schema);
