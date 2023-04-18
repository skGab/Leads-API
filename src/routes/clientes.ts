import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { coreDataBuffer, sentChunk as sentChunk, leadFilter } from './services/leadFilter';
import { clientSchema } from '../schema';

const interval = 5000; // Time to wait without requests before sending data (in ms)
let timer: ReturnType<typeof setTimeout>;

const clientes = async (app: FastifyInstance) => {
  app.post('/clientes', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const leads = clientSchema.parse(req.body).leads;

      for (const lead of leads) {
        const { coreData, otherData } = leadFilter(lead);
        coreDataBuffer.push(coreData);
      }

      clearTimeout(timer);
      timer = setTimeout(sentChunk, interval);

      res.status(200).send('Dados armazenados no buffer');
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Erro de validação:', error);
        res.status(400).send(error);
      } else {
        console.error('Erro ao enviar dados para o Big Query:', error);
        res.status(500).send(error);
      }
    }
  });
};

export default clientes;
