// Import required modules and packages
import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyCors from '@fastify/cors';
import clientes from './routes/clientes';
import * as dotenv from 'dotenv';
import { BigQuery } from '@google-cloud/bigquery';
import { auth } from './auth';
import { db_clienteSchema, db_tempSchema } from './schema';
import { createTableIfNotExists } from './services/tableHandle';
import { CoreData } from './interfaces';
import { startServer } from './server';
import { LeadSearched } from './interfaces';

// Load environment variables from the .env file
dotenv.config();

// Initialize the Fastify application
const app: FastifyInstance = fastify();

// Initialize data buffers
const dataBuffer: CoreData = [];

// Merge failed records with new records
const failedUniqueDataBuffer: CoreData = [];
const failedUpdatedDataBuffer: LeadSearched[] = [];

// Set up BigQuery client and dataset
const bigqueryClient = new BigQuery(auth);
const db_dataset = bigqueryClient.dataset('teste');

// Register the CORS plugin with custom options
app.register(fastifyCors, {
  origin: (origin, cb) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return cb(null, true);

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

// Function to set up routes and tables
(async function setupApp() {
  try {
    // Create the table if it doesn't exist
    const db_table = await createTableIfNotExists(
      db_dataset,
      'clientes',
      db_clienteSchema
    );

    const tempTable = await createTableIfNotExists(
      db_dataset,
      'temp_updated_leads',
      db_tempSchema
    );

    // Registering Routes
    app.get('/', (req: FastifyRequest, res: FastifyReply) => {
      try {
        res.status(200).send('BLACK BEANS - Leads API v.2');
      } catch (error) {
        console.error('Falha na aplicação:', error);
        res.status(500).send('Falha na aplicação');
      }
    });

    // Main route
    clientes(
      app,
      dataBuffer,
      db_dataset,
      db_table,
      tempTable,
      bigqueryClient,
      failedUniqueDataBuffer,
      failedUpdatedDataBuffer
    );

    // Start the server after setting up the app
    startServer(app);
  } catch (error) {
    console.error('Erro ao criar a tabela ou configurar rotas:', error);
  }
})();
