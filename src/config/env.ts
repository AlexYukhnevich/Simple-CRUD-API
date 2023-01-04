import * as dotenv from 'dotenv';

dotenv.config();

export const appEnv = {
  port: Number(process.env.PORT) || 4000,
  testPort: 6000,
};
