/* TODOs 
- Create a TCP server
- Accept incomming client connections (establish the connection to the client)
- Handle the request for each client connection
- Provide a response to the client connection
*/

import { Server, Socket } from 'net';

export class HttpServerSingleton {
  private static instance: HttpServerSingleton | null;
  private server: Server;

  private constructor() {
    this.server = new Server((socket: Socket) => {
      const adder = socket.remoteAddress ?? '__';

      console.log(`Incoming TCP connection from socket adder => ${adder}`);
    });
  }

  public getServer(): Server {
    return this.server;
  }

  static getInstance(): HttpServerSingleton {
    if (!this.instance) {
      this.instance = new HttpServerSingleton();
    }

    return this.instance;
  }
}
