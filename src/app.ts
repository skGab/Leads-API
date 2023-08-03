// Import required modules and packages
import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import * as dotenv from 'dotenv';
import clientes from './routes/clientes';
import { db_table, tableHandle, tempTable } from './services/tableHandle';
import { CoreData } from './helpers/interfaces';
import { startServer } from './server';
import { logger } from './services/logger';
import corsRegister from './helpers/cors';

// Load environment variables from the .env file
dotenv.config();

// Initialize the Fastify application
export const app: FastifyInstance = fastify();

// Initialize data buffers
const dataBuffer: CoreData = [];

// Register the CORS plugin with custom options
corsRegister();

// Function to set up routes and tables
(async function setupApp() {
  try {
    // Create the table if it doesn't exist
    // tableHandle();
    console.log('Tabelas criadas');

    // Registering Routes
    app.get('/', (_req: FastifyRequest, res: FastifyReply) => {
      try {
        res.status(200).send('BLACK BEANS - Leads API v.2');
      } catch (error) {
        logger.error('Falha na aplicação:', error);
        res.status(500).send('Falha na aplicação');
      }
    });

    // Main route
    clientes(dataBuffer, db_table, tempTable);

    // Start the server after setting up the app
    startServer(app);
  } catch (error) {
    logger.error('Erro ao criar a tabela ou configurar rotas:', error);
  }
}());
