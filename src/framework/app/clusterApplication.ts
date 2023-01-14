import http, { Server, IncomingMessage, ServerResponse } from 'http';
import { HttpMethod, HttpStatus } from '../../constants/http.constants';
import { AppConfig } from '../../interfaces/app.interface';
import { isString } from '../../utils/typeCheck.utils';

import Application from './baseApplication';

export default class ClusterApplication extends Application {
  server: Server<typeof IncomingMessage, typeof ServerResponse>;
  servers: string[] = [];
  _currentServer = 0;

  constructor(config: AppConfig) {
    super(config);
    this.server = this.createServer();
  }

  public addServer(server: string) {
    this.servers.push(server);
  }

  get currentServer() {
    return this._currentServer;
  }

  set currentServer(position: number) {
    if (position === this.servers.length - 1) {
      this._currentServer = 0;
    } else {
      this._currentServer = position;
    }
  }

  protected createServer() {
    return http.createServer(async (req, res) => {
      console.log(`Load balancer port: ${process.env.PORT}`);

      try {
        this.validateRequestFields(req);

        const server = this.servers[this._currentServer];
        this.currentServer = this.currentServer + 1;

        if (isString(req.url) && isString(req.method)) {
          for (const middleware of this.middlewares) {
            await middleware(req, res);
          }

          const urlPath = `${server}${req.url}`;
          const options: Record<string, unknown> = {
            method: req.method,
          };

          if ('body' in req && req.method !== HttpMethod.Get) {
            options.body = JSON.stringify(req.body);
          }

          const response = await fetch(urlPath, options);
          const jsonResponse =
            response.status !== HttpStatus.NO_CONTENT
              ? await response.json()
              : {
                  statusCode: HttpStatus.NO_CONTENT,
                };
          this.sendResponse(res, jsonResponse);
        }
      } catch (err) {
        this.catchInterceptor(req, res, err);
      }
    });
  }
}
