import { HttpMethod } from 'src/constants/http.constants';
import {
  ControllerHandler,
  ValidatorHandler,
} from 'src/interfaces/common.interface';

export interface RouteConfig {
  method: HttpMethod;
  endpoint: string;
  controller: ControllerHandler;
  validator: ValidatorHandler | null;
}
