import { BadRequestError } from 'src/errors/client.error';
import {
  ClientRequestType,
  ServerResponseType,
} from 'src/interfaces/http.interface';
import { isJSON } from 'src/utils/json.utils';

const bodyParser = async (req: ClientRequestType, res: ServerResponseType) =>
  new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk: Buffer) => (body += chunk));
    req.on('end', () => {
      if (body) {
        if (!isJSON(body)) {
          reject(
            new BadRequestError(
              'Incorrect data type. It must be like JSON structure'
            )
          );
        }

        req.body = JSON.parse(body);
      } else {
        req.body = {};
      }
      resolve(req);
    });
  });

export default bodyParser;
