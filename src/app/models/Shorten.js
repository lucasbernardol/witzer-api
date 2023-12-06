import crypto from 'node:crypto';

import mongoose, { Schema } from 'mongoose';
import { nanoid } from '../utils/nanoid.js';

const schema = new Schema(
  {
    uuid: {
      type: String,
      require: false,
      index: true,
      default: () => crypto.randomUUID(), // testing only
    },

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

    visitedAt: {
      type: Number,
      required: false,
      default: null,
    },
  },
  { timestamps: true },
);

export const Shorten = mongoose.model('Shorten', schema);
