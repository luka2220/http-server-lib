import { createHttpServer } from './server/main';

import { createConnection } from 'net';

const testServer = createHttpServer();
testServer.listen(8080, 'localhost');

// Test the running server
setTimeout(connectAndSendData, 3000);

async function connectAndSendData() {
  const client = createConnection({ port: 8080 }, () => {
    client.write('GET /index.html\r\n');
  });

  client.on('data', (data: string) => {
    console.log(`Server response -> ${data}`);
    client.end();
  });

  client.on('end', () => {
    console.log('Disconnected from server');
  });
}
