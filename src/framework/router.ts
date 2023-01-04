import { RoutesCollection } from 'src/interfaces/app.interface';
import { Handler, ValidatorHandler } from 'src/interfaces/common.interface';
import { RouteConfig } from 'src/interfaces/routes.interface';
import { HttpMethod } from 'src/constants/http.constants';

// Schema
// route = {
//   '/users': {
//      'get': {
//         handler: (req, res) => void,
//         validator: () => void,
//       }
//       'post': {
//         handler: (req, res) => void,
//         validator: () => void,
//       },
//       ...
//   }
// }

export default class Router {
  availableHttpMethods = ['get', 'post', 'put', 'delete'];
  routesCollection: RoutesCollection = {};

  constructor() {
    this.routesCollection = {};
  }

  public setRoutes(routesConfig: RouteConfig[]) {
    routesConfig.forEach(
      ({ method, endpoint, controller, validator = null }) => {
        const routerMethod = method.toLowerCase();

        if (this.availableHttpMethods.includes(routerMethod)) {
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

  private handleRoute(
    method: HttpMethod,
    endpoint: string,
    handler: Handler,
    validator: ValidatorHandler
  ) {
    if (!this.routesCollection[endpoint]) {
      this.routesCollection[endpoint] = {};
    }

    if (!this.routesCollection[endpoint][method]) {
      this.routesCollection[endpoint][method] = {
        controller: handler,
        validator,
      };
    }
  }

  public get(
    endpoint: string,
    handler: Handler,
    validator: ValidatorHandler
  ): void {
    this.handleRoute(HttpMethod.Get, endpoint, handler, validator);
  }

  public post(
    endpoint: string,
    handler: Handler,
    validator: ValidatorHandler
  ): void {
    this.handleRoute(HttpMethod.Post, endpoint, handler, validator);
  }

  public put(
    endpoint: string,
    handler: Handler,
    validator: ValidatorHandler
  ): void {
    this.handleRoute(HttpMethod.Put, endpoint, handler, validator);
  }

  public delete(
    endpoint: string,
    handler: Handler,
    validator: ValidatorHandler
  ): void {
    this.handleRoute(HttpMethod.Delete, endpoint, handler, validator);
  }
}
