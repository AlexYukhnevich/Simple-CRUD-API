/* eslint-disable no-unused-vars */
import { HttpMethod } from 'src/constants/http.constants';
import {
  ControllerHandler,
  ValidatorHandler,
} from 'src/interfaces/common.interface';

type EndpointData = {
  [key in HttpMethod]?: {
    controller: ControllerHandler;
    validator: ValidatorHandler | null;
  };
};

export interface RoutesCollection {
  [endpoint: string]: EndpointData;
}

export interface AppConfig {
  routes: string[];
}
