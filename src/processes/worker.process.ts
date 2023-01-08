import appEnv from 'src/config/env';
import BaseApplication from 'src/framework/baseApplication';

export const workerProcess = (app: BaseApplication) => {
  return app.listenServer(appEnv.port);
};
