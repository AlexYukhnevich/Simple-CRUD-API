import { HttpMethod } from '../constants/http.constants';
import {
  ControllerHandler,
  ValidatorHandler,
} from '../interfaces/common.interface';

export interface RouteConfig {
  method: HttpMethod;
  endpoint: string;
  controller: ControllerHandler;
  validator: ValidatorHandler | null;
}
