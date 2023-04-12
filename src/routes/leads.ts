import { google } from 'googleapis';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { BigQuery } from '@google-cloud/bigquery';
import path from 'path';

const leeds = async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, res: FastifyReply) => {
    try {
      res.status(200).send('BLACK BEANS - Leads API');
    } catch (error) {
      console.error('Falha na aplicação:', error);
      res.status(500).send('Falha na aplicação');
    }
  });

  app.post('/leads', async (req: FastifyRequest, res: FastifyReply) => {
    const credentials = {
      keyFilename: path.join(__dirname, '../data/credentials.json'),
      projectId: 'black-beans-dados',
    };

    const bigqueryClient = new BigQuery(credentials);

    const WebhookDataSchema = z.object({
      leads: z
        .array(
          z.object({
            id: z.string(),
            email: z.string(),
            name: z.string(),
          })
        )
        .nonempty(),
    });

    try {
      const body = WebhookDataSchema.parse(req.body);

      const { id, name, email } = body.leads[0];

      // Insert data into BigQuery
      const db_name = 'teste';
      const table_name = 'leads_table';

      const rows = [
        {
          name: name,
          id: id,
          email: email,
        },
      ];

      await bigqueryClient.dataset(db_name).table(table_name).insert(rows);

      console.log('Dados do RD:', name, id, email);
      res.status(200).send('Dados armazenados no Big Query');
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Erro de validação:', error);
        res
          .status(400)
          .send(
            'Não foram encontrados dados no body da requisição ou estão invalidos'
          );
      } else {
        console.error('Erro ao enviar dados para o Big Query:', error);
        res.status(500).send('Erro ao enviar dados para o Big Query');
      }
    }
  });
};

export default leeds;
