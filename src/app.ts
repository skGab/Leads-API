// Import required modules and packages
import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyCors from '@fastify/cors';
import clientes from './routes/clientes';
import * as dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Initialize the Fastify application
const app: FastifyInstance = fastify();

// Register the CORS plugin with default options
app.register(fastifyCors, {
  origin: true,
});

(async () => {
  // Define the root endpoint
  app.get('/', (req: FastifyRequest, res: FastifyReply) => {
    try {
      res.status(200).send('BLACK BEANS - Leads API');
    } catch (error) {
      console.error('Falha na aplicação:', error);
      res.status(500).send('Falha na aplicação');
    }
  });

  // Register the leads route
  await clientes(app);

  // Check if we are in a production environment
  if (process.env.NODE_ENV === 'production') {
    // Start the server in production mode
    app.listen({ port: 0, host: '0.0.0.0' } as any, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server is listening on the Unix domain socket: ${address}`);
    });
  } else {
    // Start the server in development mode
    app.listen({ port: 3333, host: '0.0.0.0' } as any, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server is listening on ${address}`);
    });
  }
})();
