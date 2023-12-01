import process from 'node:process';
import mongoose from 'mongoose';

export async function connect() {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URI, {
      autoIndex: true,
    });

    console.log('\nDatabase connected!');

    return connection;
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}
