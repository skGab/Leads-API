import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { leadSchema } from '../schema';
import { leadFilter } from './services/leadFilter';
import { createTableIfNotExists } from './services/tableHandle';
import { BigQuery, Dataset } from '@google-cloud/bigquery';
import { interval } from '../app';
import { sentChunk } from './services/sentChunk';

let timer: ReturnType<typeof setTimeout>;

const oportunidades = (
  app: FastifyInstance,
  opportunityBuffer: Array<any>,
  db_dataset: Dataset,
  bigqueryCliente: BigQuery
) => {
  app.post(
    '/oportunidades',
    async (request: FastifyRequest, reply: FastifyReply) => {
      // if not create one and store the data
      // if yes need to check for existing leads
      // if existing lead update the fields "opportunity, lead_stage"
      // if not existing store the data

      try {
        // Will receive all core fields
        const { leads } = leadSchema.parse(request.body);

        // Filter and process each lead
        leads.forEach((lead) => {
          const { coreData } = leadFilter(lead);
          opportunityBuffer.push(coreData);
        });

        // Checking if has table
        // Preparring to sent the data
        clearTimeout(timer);
        timer = setTimeout(
          () => sentChunk(opportunityBuffer, db_dataset, bigqueryCliente),
          interval
        );

        console.log('Leads atualizados', leads);
        reply.status(200).send('Leads atualizados');
      } catch (error) {
        console.log('Erro ao atualizar os dados', error);
        reply.status(500).send('Erro ao atualizar os dados');
      }
    }
  );
};

export default oportunidades;
