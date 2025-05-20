/* TODOs 
- Create a TCP server
- Accept incomming client connections (establish the connection to the client)
- Handle the request for each client connection
- Provide a response to the client connection
*/

import { Server, Socket } from 'net';

let serverInstance: Server | null = null;

export function createHttpServer(): Server {
  serverInstance = new Server((socket: Socket) => {
    const addr = socket.remoteAddress ?? '__';

    console.log(`Incoming TCP connection from socket addr => ${addr}`);
  });

  return serverInstance;
}

export function getServerInstance(): Server {
  if (!serverInstance) {
    return createHttpServer();
  }

  return serverInstance;
}
