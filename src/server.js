import process from 'node:process';

import { connect } from './database/connect.js';
import { app } from './app.js';

const PORT = Number(process.env?.PORT ?? 3333);

export default async function bootstrap() {
  await connect(); // MongoDB

  app.listen(PORT, () => console.log(`\nPORT: ${PORT}`));
}
