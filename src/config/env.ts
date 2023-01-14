import * as dotenv from 'dotenv';

dotenv.config();

const appEnv = {
  port: Number(process.env.PORT) || 4000,
  testPort: 6000,
  protocol: 'http',
  host: 'localhost',
  env: process.env.NODE_ENV,
  isCluster: !!process.argv.slice(2).find((cmd) => cmd === 'multi'),
};

export default appEnv;
