import net from 'node:net';
import { RedisParser } from './parser.js';
import {
  DataStoreHashtable,
  DataStoreMap,
  DataStoreObject,
} from './datastore.js';

const clientParsers = [];

function startServer() {
  const datastore = new DataStoreHashtable(10000);

  const server = net.createServer({
    keepAlive: true,
    noDelay: true,
  });

  process.on('SIGHUP', () => {
    const stats = datastore.stats();
    console.log(`Datastore: ${JSON.stringify(stats, null, 2)}`);
  });

  server.on('connection', (socket) => {
    //console.log('client connected');
    const clientParser = new RedisParser(socket, datastore);
    clientParsers.push(clientParser);

    socket.on('end', () => {
      //console.log('client disconnected');
    });

    socket.on('data', (data) => {
      //console.log(`Data received: ${data}`);
      clientParser.processCommands(data);
    });
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
