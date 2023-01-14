import Router from '../framework/router/router';
import {
  usersRoutesConfig,
  usersEndpoints,
} from '../components/user/user.routes';

const routesConfig = [...usersRoutesConfig];
const allRoutes = [...usersEndpoints];

const router = new Router();
router.setRoutes(routesConfig);

export { router, allRoutes };
