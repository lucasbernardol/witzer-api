import process from 'node:process';
import mongoose from 'mongoose';

export class MongoConnect {
  #URI = process.env.DATABASE_URI;

  #events() {
    mongoose.connection.on('error', this.#error);
    mongoose.connection.on('open', this.#open);
  }

  async connect() {
    this.#events(); // Add mongoose events.

    try {
      const connection = await mongoose.connect(this.#URI, {
        autoIndex: true,
      });

      return connection;
    } catch (error) {
      return this.#error(error);
    }
  }

  #open() {
    console.log('\nMongoDB: OK');
  }

  #error(error) {
    console.error(error);

    return process.exit(1);
  }
}

export default new MongoConnect();
