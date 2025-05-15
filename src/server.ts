/* TODOs 
- Create a TCP server
- Accept incomming client connections (establish the connection to the client)
- Handle the request for each client connection
- Provide a response to the client connection
*/

import { Server, Socket } from 'net';

interface Connection {
  port: string;
}

const HttpServer = new Server((socket: Socket) => {
  const addr = socket.remoteAddress ?? '__';

  console.log(`Incoming TCP connection from socket addr => ${addr}`);
});

HttpServer.on('connection', (socket: Socket) => {
  const addr = socket.remoteAddress ?? '__';

  socket.on('data', (chunk: Buffer) => {
    const parsedData = chunk.subarray(0, chunk.length - 1);
    console.log(`[${addr}] Data received => ${parsedData.toString('ascii')}`);
  });
});

HttpServer.listen(8080, 'localhost');
