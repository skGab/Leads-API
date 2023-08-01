import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { leadSchema } from '../schema';
import { scopeCoreData } from '../services/scopeCoreData';
import { Table } from '@google-cloud/bigquery';
import { sentStreaming } from '../services/sentStreaming';
import { CoreData } from '../interfaces';
import { logger } from '../services/logger';
import { db_dataset } from '../auth';
import { app } from '../app';
import { bigqueryClient } from '../auth';

const clientes = (dataBuffer: CoreData, db_table: Table, tempTable: Table) => {
  // Time to wait without requests before sending data (in ms)
  let sendTimer: NodeJS.Timeout | null = null;
  let interval = 5000;

  // Define the /clientes POST endpoint
  app.post('/clientes', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      // Parse and validate the request body
      const leads = leadSchema.parse(req.body).leads;

      // Scoping and process each lead
      leads.forEach((lead) => {
        const { coreData } = scopeCoreData(lead);

        dataBuffer.push(coreData);
      });

      console.log('Leads recebidos:', dataBuffer.length);
      console.log('---------------------------------------');

      // Cancel previous timer if it exists
      if (sendTimer !== null) {
        clearTimeout(sendTimer);
      }
      // Set a new timer
      sendTimer = setTimeout(async () => {
        try {
          await sentStreaming(
            dataBuffer,
            db_dataset,
            db_table,
            tempTable,
            bigqueryClient
          );
          console.log('Leads armazenados no BigQuery');
          res.status(200).send('Dados armazenados no BigQuery');
        } catch (error) {
          logger.error('Erro ao enviar dados para o BigQuery:', error);
          res.status(500).send(error);
        }
      }, interval); // 5-second delay
      res.status(202).send('Dados na fila de inserção');
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        logger.error('Erro de validação:', error);
        res.status(400).send(error);
      } else {
        // Handle other errors
        logger.error('Erro ao enviar dados para o BigQuery:', error);
        res.status(500).send(error);
      }
    }
  });
};

export default clientes;
