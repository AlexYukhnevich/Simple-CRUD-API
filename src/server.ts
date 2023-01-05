import { appEnv } from './config/env';
import Application from './framework/application';
import bodyParser from './middlewares/bodyParser';
import { allRoutes, router } from './routes/index.routes';

function createServer() {
  const app = new Application({
    port: process.env.NODE_ENV === 'test' ? appEnv.testPort : appEnv.port,
    routes: allRoutes,
  });

  app.use(bodyParser);
  app.applyRoutes(router.routesCollection);

  return app;
}

export default createServer;
