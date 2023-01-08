import os from 'os';
import { fork } from 'child_process';
import path from 'path';
import cluster, { Worker } from 'cluster';
import appEnv from 'src/config/env';
import BaseApplication from 'src/framework/baseApplication';
import { MessageType } from 'src/constants/process.constants';

export const masterProcess = (app: BaseApplication) => {
  const NUM_CPUS = os.cpus().length;
  const DATABASE_PATH = path.resolve(process.cwd(), 'db/db.ts');
  const dbProcess = fork(DATABASE_PATH);

  if (cluster.isPrimary) {
    let activeWorker: Worker;

    for (let i = 0; i < NUM_CPUS; i++) {
      const workerPort = appEnv.port + i + 1;
      const workerServerUrl = `${appEnv.protocol}://${appEnv.host}:${workerPort}`;
      cluster.fork({ PORT: workerPort });
      app.addServer(workerServerUrl);
    }

    cluster.on('exit', (worker) =>
      console.log(`worker ${worker.process.pid} died`)
    );

    // 1. Get settings from "UsersRepository" for database
    cluster.on('message', (worker, message) => {
      activeWorker = worker;
      dbProcess.send({ type: MessageType.Database, ...message });
    });

    // 2. Get data from database and send again to the "active" worker
    dbProcess.on('message', (msg) => {
      activeWorker?.send(msg);
    });
  }

  return app.listenServer(appEnv.port);
};
