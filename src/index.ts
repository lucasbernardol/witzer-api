import 'dotenv/config';

import process from 'node:process';
import { server } from './server';

const PORT = process.env.PORT || 3333;

const serverInstance = server.listen(PORT, () => {
  console.log(`\nPORT: ${PORT}`);
});
