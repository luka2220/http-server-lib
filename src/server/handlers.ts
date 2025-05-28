import {
  accessSync,
  createReadStream,
  createWriteStream,
  WriteStream,
} from 'fs';
import { HttpServerSingleton } from './main';

import { Socket } from 'net';
import { join } from 'path';

const httpServer = HttpServerSingleton.getInstance().getServer();

httpServer.on('connection', readBuffer);

let sockInstance: Socket | null = null;

async function readBuffer(socket: Socket) {
  sockInstance = socket;

  socket.setEncoding('ascii');
  socket.on('data', parseHttpRequest);
}

function parseHttpRequest(buffer: string) {
  if (!sockInstance) {
    console.error('No socket instance');
    return;
  }

  const request = buffer.slice(0, buffer.length - 2).split(' ');
  const [method, resource] = request;

  const { isValid, path } = validateResquest(method, resource);

  if (!isValid) {
    sockInstance.write('ERROR\n');
    sockInstance.end('Closing connection to test client');
    return;
  }

  const file = createReadStream(path);
  file.pipe(sockInstance);
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
