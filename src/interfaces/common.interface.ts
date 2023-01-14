import { MimeType } from '../constants/http.constants';

export type Response = {
  statusCode: number;
  data?: unknown;
  mimeType?: MimeType;
  errorMessage?: string;
};

export type ControllerHandler = (req: any, res: any) => Promise<Response>;
export type ValidatorHandler = (req: any, res: any) => void;
export type MiddlewareHandler = (req: any, res: any) => void;
