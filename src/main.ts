import cluster from 'node:cluster';
import appEnv from './config/env';
import createServer from './server';
import { masterProcess, workerProcess } from './processes';

const app = createServer();

if (appEnv.isCluster) {
  cluster.isPrimary ? masterProcess(app) : workerProcess(app);
} else {
  if (appEnv.env !== 'test') {
    app.listenServer(appEnv.port);
  }
}

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

export { app };
