import cluster from 'cluster';
import appEnv from './config/env';
import BaseApplication from './framework/app/baseApplication';
import ClusterApplication from './framework/app/clusterApplication';
import bodyParser from './middlewares/bodyParser';
import { allRoutes, router } from './routes/index.routes';

function createServer() {
  const Application =
    appEnv.isCluster && cluster.isPrimary
      ? ClusterApplication
      : BaseApplication;

  const app = new Application({
    routes: allRoutes,
  });

  app.use(bodyParser);
  app.applyRoutes(router.routesCollection);

  return app;
}

export default createServer;
