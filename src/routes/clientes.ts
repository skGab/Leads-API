import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { clientSchema } from '../schema';
import { leadFilter, coreDataBuffer } from './services/leadFilter';
import { sentChunk } from './services/sentChunk';

const interval = 5000; // Time to wait without requests before sending data (in ms)
let timer: ReturnType<typeof setTimeout>;

const clientes = async (app: FastifyInstance) => {
  // Define the /clientes POST endpoint
  app.post('/clientes', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      // Parse and validate the request body
      const leads = clientSchema.parse(req.body).leads;

      // Filter and process each lead
      leads.forEach((lead) => {
        const { coreData } = leadFilter(lead);
        coreDataBuffer.push(coreData);
      });

      // Clear the existing timer and set a new one
      clearTimeout(timer);
      timer = setTimeout(sentChunk, interval);

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
