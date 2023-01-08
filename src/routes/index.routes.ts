import Router from '../framework/router';
import {
  usersRoutesConfig,
  usersEndpoints,
} from 'src/components/user/user.routes';

const routesConfig = [...usersRoutesConfig];
const allRoutes = [...usersEndpoints];

const router = new Router();
router.setRoutes(routesConfig);

export { router, allRoutes };
