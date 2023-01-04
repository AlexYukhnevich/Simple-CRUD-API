import http, { Server, IncomingMessage, ServerResponse } from 'http';
import { EventEmitter } from 'events';
import { AppConfig, RoutesCollection } from 'src/interfaces/app.interface';
import { isString } from 'src/utils/typeCheck.utils';
import { Handler } from 'src/interfaces/common.interface';
import { getUrlMeta } from 'src/utils/parseUrl.utils';
import { NotFoundError } from 'src/errors/client.error';
import HttpException from 'src/errors/http-exception.error';
import { toJSON } from 'src/utils/json.utils';
import {
  MimeType,
  MIME_TYPES,
  responseMap,
  HttpStatus,
} from 'src/constants/http.constants';

export default class Application {
  emitter: EventEmitter;
  server: Server<typeof IncomingMessage, typeof ServerResponse>;
  config: AppConfig;
  middlewares: Handler[];

  constructor(config: AppConfig) {
    this.emitter = new EventEmitter();
    this.server = this.createServer();
    this.config = config;
    this.middlewares = [];
  }

  use(middleware: Handler) {
    this.middlewares.push(middleware);
  }

  public applyRoutes(routesCollection: RoutesCollection) {
    Object.entries(routesCollection).forEach(([endpoint, config]) => {
      Object.entries(config).forEach(([httpMethod, handlers]) => {
        const { controller, validator } = handlers;
        const eventMask = this.generateEventMask(endpoint, httpMethod);

        this.emitter.on(eventMask, async (req, res) => {
          try {
            for (const middleware of this.middlewares) {
              await middleware(req, res);
            }
            validator?.(req, res);
            await controller(req, res);
          } catch (err) {
            this.catchInterceptor(req, res, err);
          }
        });
      });
    });
  }

  private createServer() {
    return http.createServer((req, res) => {
      try {
        if (isString(req.url) && isString(req.method)) {
          const { endpoint, params } = getUrlMeta(
            this.config.routes,
            req.url as string
          );
          // @ts-ignore
          req.params = params;

          const eventMask = this.generateEventMask(
            endpoint,
            req.method as string
          );
          const isEmitted = this.emitter.emit(eventMask, req, res);

          if (!isEmitted) {
            throw new NotFoundError('Endpoint Not Found');
          }
        }
      } catch (err: unknown) {
        this.catchInterceptor(req, res, err);
      }
    });
  }

  listenServer() {
    return this.server.listen(this.config.port, () =>
      console.log(`Server has been started on port ${this.config.port}`)
    );
  }

  private generateEventMask(endpoint: string, method: string) {
    return `[${endpoint}]:[${method}]`;
  }

  private catchInterceptor(req: any, res: any, err: unknown) {
    const mimeTypeHeader = { 'Content-Type': MIME_TYPES[MimeType.JSON] };

    if (err instanceof HttpException) {
      res
        .writeHead(err.statusCode, mimeTypeHeader)
        .end(toJSON({ statusCode: err.statusCode, errorMessage: err.message }));
    } else {
      res.writeHead(HttpStatus.INTERNAL_SERVER_ERROR, mimeTypeHeader).end(
        toJSON({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorMessage: responseMap[HttpStatus.INTERNAL_SERVER_ERROR],
        })
      );
    }
  }
}
