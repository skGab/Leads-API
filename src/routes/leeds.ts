import { google } from 'googleapis';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const leeds = async (app: FastifyInstance) => {
  // Carregue suas credenciais do arquivo JSON baixado
  const sheets = google.sheets('v4');
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // Autenticação
  const auth = new google.auth.GoogleAuth({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authToken = await auth.getClient();

  interface QueryParams {
    name: string;
    email: string;
  }

  app.get(
    '/',
    async (
      req: FastifyRequest<{ Querystring: QueryParams }>,
      res: FastifyReply
    ) => {
      // Dados da requisição que você deseja enviar para a planilha
      const leadName = req.query.name;
      const leadEmail = req.query.email;

      const requestData = [
        new Date().toISOString(),
        req.ip,
        leadName,
        leadEmail,
        // Adicione outros dados conforme necessário
      ];

      // Adicione os dados na planilha
      try {
        await sheets.spreadsheets.values.append({
          auth: authToken,
          spreadsheetId,
          range: 'Sheet1!A1:E', // Adjust the range as necessary
          valueInputOption: 'RAW',
          requestBody: {
            values: [requestData],
          },
        });
        res.send('Dados enviados para a planilha do Google');
      } catch (error) {
        console.error('Erro ao enviar dados para a planilha do Google:', error);
        res.status(500).send('Erro ao enviar dados para a planilha do Google');
      }
    }
  );
};

export default leeds;
