import { fastifyCors } from '@fastify/cors';
import { app } from '../app';

// When the function corsRegister() is called, it modifies the app object by registering the CORS plugin and setting up the origin-checking logic.
export default function corsRegister() {
  app.register(fastifyCors, {
    origin: (origin, cb) => {
      // Dont allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return cb(null, false);

      // Check if the origin matches the allowed domain
      if (origin === 'https://app.rdstation.com.br') {
        return cb(null, true);
      } else {
        // Return an error if the origin does not match the allowed domain
        const corsError = new Error('403: Not allowed by CORS');
        return cb(corsError, false);
      }
    },
  });
  return;
}
