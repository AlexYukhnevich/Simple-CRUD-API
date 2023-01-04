/* eslint-disable no-unused-vars */
import { HttpMethod } from 'src/constants/http.constants';
import { Handler, ValidatorHandler } from 'src/interfaces/common.interface';

type EndpointData = {
  [key in HttpMethod]?: {
    controller: Handler;
    validator: ValidatorHandler | null;
  };
};

export interface RoutesCollection {
  [endpoint: string]: EndpointData;
}

export interface AppConfig {
  port: number;
  routes: string[];
}
