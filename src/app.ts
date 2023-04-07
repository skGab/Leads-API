import fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import leeds from './routes/leeds';

const app: FastifyInstance = fastify();

app.register(fastifyCors, {
  origin: true,
});

(async () => {
  await leeds(app);

  // Unix domain socket
  const unixDomainSocket =
    '/srv/leeds-api.c09b59be.configr.cloud/etc/nodejs/nodejs.sock';

  // TCP/IP address and port
  const host = '0.0.0.0';
  const port = process.env.Port ? Number(process.env.Port) : 3333;

  // Check if the environment requires listening on a Unix domain socket
  if (process.env.USE_UNIX_SOCKET) {
    app.listen({ socket: unixDomainSocket } as any, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server is listening on the Unix domain socket: ${address}`);
    });
  } else {
    app.listen({ port, host } as any, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server is listening on ${address}`);
    });
  }
})();
