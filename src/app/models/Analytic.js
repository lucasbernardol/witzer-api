import mongoose, { Schema, Types } from 'mongoose';

const schema = new Schema(
  {
    userAgent: {
      type: String,
      require: true,
      maxLength: 2048,
      trim: true,
    },
    shortenId: {
      type: Types.ObjectId,
      ref: 'Shorten',
    },
  },
  { timestamps: true },
);

export const Analytic = mongoose.model('Analytic', schema);
