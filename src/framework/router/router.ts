import { RoutesCollection } from '../../interfaces/app.interface';
import {
  ControllerHandler,
  ValidatorHandler,
} from '../../interfaces/common.interface';
import { RouteConfig } from '../../interfaces/routes.interface';
import { HttpMethod } from '../../constants/http.constants';

// Schema
// route = {
//   '/users': {
//      'get': {
//         controller: (req, res) => void,
//         validator: () => void,
//       }
//       'post': {
//         controller: (req, res) => void,
//         validator: () => void,
//       },
//       ...
//   }
// }

export default class Router {
  routesCollection: RoutesCollection = {};

  constructor() {
    this.routesCollection = {};
  }

  public setRoutes(routesConfig: RouteConfig[]) {
    routesConfig.forEach(
      ({ method, endpoint, controller, validator = null }) => {
        if (this.validateMethod(method)) {
          const routerMethod = method.toLowerCase();
          if (validator) {
            // @ts-ignore
            this[routerMethod](endpoint, controller, validator);
          } else {
            // @ts-ignore
            this[routerMethod](endpoint, controller);
          }
        }
      }
    );
  }

  private validateMethod(method: HttpMethod): method is HttpMethod {
    return Object.values(HttpMethod).includes(method);
  }

  private handleRoute(
    method: HttpMethod,
    endpoint: string,
    controller: ControllerHandler,
    validator: ValidatorHandler
  ) {
    if (!this.routesCollection[endpoint]) {
      this.routesCollection[endpoint] = {};
    }

    if (!this.routesCollection[endpoint][method]) {
      this.routesCollection[endpoint][method] = { controller, validator };
    }
  }

  public get(
    endpoint: string,
    controller: ControllerHandler,
    validator: ValidatorHandler
  ): void {
    this.handleRoute(HttpMethod.Get, endpoint, controller, validator);
  }

  public post(
    endpoint: string,
    controller: ControllerHandler,
    validator: ValidatorHandler
  ): void {
    this.handleRoute(HttpMethod.Post, endpoint, controller, validator);
  }

  public put(
    endpoint: string,
    controller: ControllerHandler,
    validator: ValidatorHandler
  ): void {
    this.handleRoute(HttpMethod.Put, endpoint, controller, validator);
  }

  public delete(
    endpoint: string,
    controller: ControllerHandler,
    validator: ValidatorHandler
  ): void {
    this.handleRoute(HttpMethod.Delete, endpoint, controller, validator);
  }
}
