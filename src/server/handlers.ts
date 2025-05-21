import { HttpServerSingleton } from './main';

import { Socket, Server } from 'net';

const httpServer = HttpServerSingleton.getInstance().getServer();

httpServer.on('connection', parseDataFromClient);

/*-----Data Handlers-----*/
function parseDataFromClient(socket: Socket) {
  socket.setEncoding('ascii');

  socket.on('data', (buffer: string) => {
    console.log(
      `Incoming buffer data type->[${typeof buffer}]; Data->[${buffer}]`,
    );
  });
}
