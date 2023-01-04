import { HttpMethod } from 'src/constants/http.constants';
import { Handler } from 'src/interfaces/common.interface';

export interface RouteConfig {
  method: HttpMethod;
  endpoint: string;
  controller: Handler;
  validator: Handler | null;
}
