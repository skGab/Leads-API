import { FastifyInstance } from 'fastify';

// Function to start the server
export function startServer(app: FastifyInstance) {
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
}
