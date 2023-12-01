import mongoose, { Schema } from 'mongoose';

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
    },

    redirectings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Url = mongoose.model('Url', schema);
