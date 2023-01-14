import http, { Server, IncomingMessage, ServerResponse } from 'http';
import { EventEmitter } from 'events';
import { AppConfig, RoutesCollection } from '../../interfaces/app.interface';
import { MiddlewareHandler, Response } from '../../interfaces/common.interface';
import { getUrlMeta } from '../../utils/parseUrl.utils';
import { isString } from '../../utils/typeCheck.utils';
import { BadRequestError, NotFoundError } from '../../errors/client.error';
import HttpException from '../../errors/http-exception.error';
import { toJSON } from '../../utils/json.utils';
import {
  MimeType,
  responseMap,
  HttpStatus,
  HttpMethod,
} from '../../constants/http.constants';
import appEnv from '../../config/env';
import { ERROR_MESSAGES } from '../../constants/error.constants';

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
        this.validateRequestFields(req);
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
          throw new NotFoundError(
            ERROR_MESSAGES[HttpStatus.NOT_FOUND]?.entityNotFound('Endpoint')
          );
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

  protected validateRequestFields(req: IncomingMessage) {
    if (!isString(req.url)) {
      throw new BadRequestError(
        ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.incorrectFieldDataType(
          'url',
          'string'
        )
      );
    }

    if (!isString(req.method)) {
      throw new BadRequestError(
        ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.incorrectFieldDataType(
          'method',
          'string'
        )
      );
    }

    const availableHttpMethods = Object.values(HttpMethod).map((method) =>
      method.toUpperCase()
    );

    if (!availableHttpMethods.includes((req.method as string).toUpperCase())) {
      throw new BadRequestError(
        ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.forbiddenOptions(
          req.method as string,
          availableHttpMethods
        )
      );
    }
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
