import 'dotenv/config';

import process from 'node:process';
import { app } from './app.js';

const PORT = Number(process.env?.PORT ?? 3333);

app.listen(PORT, () => {
  console.log(`\nPORT:${PORT}`);
});
