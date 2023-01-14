import appEnv from '../config/env';
import BaseApplication from '../framework/app/baseApplication';

export const workerProcess = (app: BaseApplication) => {
  return app.listenServer(appEnv.port);
};
