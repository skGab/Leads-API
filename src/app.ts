import fastify, { FastifyInstance } from 'fastify';
// import { PrismaClient } from '@prisma/client';
// import users from './routes/users';
import fastifyCors from '@fastify/cors';
import leeds from './routes/leeds';
import { IncomingMessage, ServerResponse } from 'http';
import { createServer, Server } from 'http';

const app: FastifyInstance = fastify();

// const prisma = new PrismaClient();

app.register(fastifyCors, {
  origin: true,
});

leeds(app);

// users(app, prisma);

const rawServer = app.server;

const server: Server = createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    rawServer.emit('request', req, res);
  }
);

server.listen('/srv/leeds-api.c09b59be.configr.cloud/etc/nodejs/nodejs.sock');

server.on('error', (err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});

server.on('listening', () => {
  console.log('Server is listening on the Unix domain socket');
});
