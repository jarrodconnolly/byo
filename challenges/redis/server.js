import net from 'node:net';
import { RedisParser } from './parser.js';
import { DataStore } from './datastore.js';

const clientParsers = [];

function startServer() {
  const dataStore = new DataStore();

  const server = net.createServer({
    keepAlive: true,
    noDelay: true,
  });

  server.on('connection', (socket) => {
    //console.log('client connected');
    const clientParser = new RedisParser(socket, dataStore);
    clientParsers.push(clientParser);

    socket.on('end', () => {
      //console.log('client disconnected');
    });

    socket.on('data', (data) => {
      //console.log(`Data received: ${data}`);
      //processCommands(data);
      clientParser.processCommands(data);
    });

    //setServerSocket(socket);
  });

  server.on('error', (err) => {
    throw err;
  });

  server.on('close', () => {
    console.log('server closed');
  });

  server.on('listening', () => {
    const listen = server.address();
    console.log(`Server listening on: ${listen.address}:${listen.port}`);
  });

  server.on('drop', (data) => {
    console.log('client dropped');
  });

  server.listen({
    port: 6379,
    host: '127.0.0.1',
  });
}

export { startServer };
