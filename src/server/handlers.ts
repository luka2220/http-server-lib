import { getServerInstance } from './main';

import { Socket } from 'net';

const httpServer = getServerInstance();

/*-----Server Handlers-----*/
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
