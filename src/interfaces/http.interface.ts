import { IncomingMessage, ServerResponse } from 'http';

export type ClientRequestType = IncomingMessage & {
  params: Record<string, string>;
  body: Record<string, unknown>;
};
export type ServerResponseType = ServerResponse<IncomingMessage> & {
  req: ClientRequestType;
};
