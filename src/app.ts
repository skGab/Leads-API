import fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import leeds from './routes/leads';
import * as dotenv from 'dotenv';

dotenv.config();

const app: FastifyInstance = fastify();

app.register(fastifyCors, {
  origin: true,
});

(async () => {
  await leeds(app);
  // Check if we are in a production environment
  if (process.env.NODE_ENV === 'production') {
    app.listen({ port: 3333, host: '0.0.0.0' } as any, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server is listening on ${address}`);
    });
  } else {
    app.listen({ port: 0, host: '0.0.0.0' } as any, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server is listening on the Unix domain socket: ${address}`);
    });
  }
})();
