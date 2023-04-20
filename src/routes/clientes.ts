import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { CoreData, leadSchema } from '../schema';
import { leadFilter } from './services/leadFilter';
import { sentChunk } from './services/sentChunk';
import { BigQuery, Dataset } from '@google-cloud/bigquery';
import { interval } from '../app';

let timer: ReturnType<typeof setTimeout>;

const clientes = (
  app: FastifyInstance,
  clienteBuffer: CoreData,
  db_dataset: Dataset,
  bigqueryCliente: BigQuery
) => {
  // Define the /clientes POST endpoint
  app.post('/clientes', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      // Parse and validate the request body
      const leads = leadSchema.parse(req.body).leads;

      // Filter and process each lead
      leads.forEach((lead) => {
        const { coreData } = leadFilter(lead);
        clienteBuffer.push(coreData);
      });

      // Clear the existing timer and set a new one
      clearTimeout(timer);
      timer = setTimeout(
        () => sentChunk(clienteBuffer, db_dataset, bigqueryCliente),
        interval
      );

      // Send a success response
      res.status(200).send('Dados armazenados no buffer');
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        console.error('Erro de validação:', error);
        res.status(400).send(error);
      } else {
        // Handle other errors
        console.error('Erro ao enviar dados para o Big Query:', error);
        res.status(500).send(error);
      }
    }
  });
};

export default clientes;
