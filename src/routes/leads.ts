import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { BigQuery } from '@google-cloud/bigquery';
import { auth } from '../auth';
import { coreData, leadFilter, otherData } from './services/leadFilter';
import { Clientes } from '../interfaces';
import { clientSchema } from '../schema';

const leeds = async (app: FastifyInstance) => {
  app.post('/clientes', async (req: FastifyRequest, res: FastifyReply) => {
    const bigqueryClient = new BigQuery(auth);

    try {
      const { leads: coreLeads } = clientSchema.parse(req.body);

      // const { leads } = req.body as Clientes;

      leadFilter(coreLeads);

      console.log(coreData);
      console.log(otherData);

      // data.forEach((lead) => {
      //   console.log('Dados do RD:', lead);
      // });

      // leads.map((lead) => {});

      // Insert data into BigQuery
      // const db_name = 'teste';
      // const table_name = 'leads_table';

      // const options = {};

      // const rows = [
      //   {
      //     name: name,
      //     id: id,
      //     email: email,
      //   },
      // ];

      // await bigqueryClient.dataset(db_name).createTable(table_name, options);

      res.status(200).send('Dados armazenados no Big Query');
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

export default leeds;
