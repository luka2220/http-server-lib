import { accessSync, createReadStream, ReadStream } from 'fs';
import { HttpServerSingleton } from './main';

import { Socket } from 'net';
import { join } from 'path';
import { pipeline } from 'stream';

const httpServer = HttpServerSingleton.getInstance().getServer();

httpServer.on('connection', readBuffer);

interface ResponseData {
  isValid: boolean;
  stream?: ReadStream;
}

async function readBuffer(socket: Socket) {
  try {
    socket.setEncoding('ascii');
    socket.on('data', (buffer: string) => {
      const { isValid, stream } = parseHttpRequest(buffer);

      if (isValid && stream) {
        pipeline(stream, socket, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      const err = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
      console.error(
        `An error occured when handling the socket...\n${JSON.stringify(err)}`,
      );
    }
  }
}

function parseHttpRequest(buffer: string): ResponseData {
  const request = buffer.slice(0, buffer.length - 2).split(' ');
  const [method, resource] = request;

  const { isValid, path } = validateResquest(method, resource);

  if (!isValid) {
    return {
      isValid: false,
    };
  }

  const file = createReadStream(path);

  return {
    isValid: true,
    stream: file,
  };
}

interface ClientRequest {
  isValid: boolean;
  path: string;
}

/**
 * Validates the http request by check the method and resource
 * * Mehtod should only be a GET request
 * * Resource should be a valid file on the server
 */
export function validateResquest(
  method: string,
  resource: string,
): ClientRequest {
  // leave for now, add a file parsing function later
  const r = resource.slice(1);
  const path = join(__dirname, '..', '..', 'file_system', r);

  let validResource = false;
  try {
    accessSync(path);
    validResource = true;
  } catch {
    validResource = false;
  }

  return { isValid: method === 'GET' && validResource, path };
}
