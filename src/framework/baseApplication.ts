import http, { Server, IncomingMessage, ServerResponse } from 'http';
import { EventEmitter } from 'events';
import { AppConfig, RoutesCollection } from 'src/interfaces/app.interface';
import { isString } from 'src/utils/typeCheck.utils';
import { MiddlewareHandler, Response } from 'src/interfaces/common.interface';
import { getUrlMeta } from 'src/utils/parseUrl.utils';
import { NotFoundError } from 'src/errors/client.error';
import HttpException from 'src/errors/http-exception.error';
import { toJSON } from 'src/utils/json.utils';
import {
  MimeType,
  responseMap,
  HttpStatus,
} from 'src/constants/http.constants';
import appEnv from 'src/config/env';

export default class BaseApplication extends EventEmitter {
  server: Server<typeof IncomingMessage, typeof ServerResponse>;
  config: AppConfig;
  middlewares: MiddlewareHandler[];
  servers: string[] = [];

  constructor(config: AppConfig) {
    super();
    this.server = this.createServer();
    this.config = config;
    this.middlewares = [];
  }

  public use(middleware: MiddlewareHandler) {
    this.middlewares.push(middleware);
  }

  public addServer(server: string) {
    this.servers.push(server);
  }

  public applyRoutes(routesCollection: RoutesCollection) {
    Object.entries(routesCollection).forEach(([endpoint, config]) => {
      Object.entries(config).forEach(([httpMethod, handlers]) => {
        const { controller, validator } = handlers;
        const eventMask = this.generateEventMask(endpoint, httpMethod);

        this.on(eventMask, async (req, res) => {
          try {
            validator?.(req, res);
            const response = await controller(req, res);
            this.sendResponse(res, response);
          } catch (err) {
            this.catchInterceptor(req, res, err);
          }
        });
      });
    });
  }

  protected createServer() {
    return http.createServer(async (req, res) => {
      if (appEnv.isCluster) {
        console.log(`Working server port: ${process.env.PORT}`);
      }

      try {
        if (isString(req.url) && isString(req.method)) {
          const { endpoint, params } = getUrlMeta(
            this.config.routes,
            req.url as string
          );
          // @ts-ignore
          req.params = params;

          for (const middleware of this.middlewares) {
            await middleware(req, res);
          }

          const eventMask = this.generateEventMask(
            endpoint,
            req.method as string
          );
          const isEmitted = this.emit(eventMask, req, res);

          if (!isEmitted) {
            throw new NotFoundError('Endpoint Not Found');
          }
        }
      } catch (err: unknown) {
        this.catchInterceptor(req, res, err);
      }
    });
  }

  public listenServer(port: number) {
    return this.server.listen(port, () =>
      console.log(`Server has been started on port ${port}`)
    );
  }

  protected generateEventMask(endpoint: string, method: string) {
    return `[${endpoint}]:[${method}]`;
  }

  protected sendResponse(
    res: any,
    { mimeType = MimeType.JSON, ...data }: Response
  ) {
    return res
      .writeHead(data.statusCode, { 'Content-Type': mimeType })
      .end(
        data.statusCode !== HttpStatus.NO_CONTENT ? toJSON(data) : undefined
      );
  }

  protected catchInterceptor(req: any, res: any, err: unknown) {
    const responseData =
      err instanceof HttpException
        ? {
            statusCode: err.statusCode,
            errorMessage: err.message,
          }
        : {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            errorMessage: responseMap[HttpStatus.INTERNAL_SERVER_ERROR],
          };
    this.sendResponse(res, responseData);
  }
}
