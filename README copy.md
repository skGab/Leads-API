Instalação
Certifique-se de ter o Node.js >= 12 instalado em sua máquina.
Clone o repositório.
Execute npm install para instalar as dependências.

Configuração
Certifique-se de adicionar o arquivo credentials.json para autenticação do Google Cloud na pasta www/data.

Executando o servidor
Existem três scripts disponíveis no package.json:

dev: Inicia o servidor no modo de desenvolvimento usando tsx watch src/app.ts.
build: Compila os arquivos de origem TypeScript usando tsup src.
start: Inicia o servidor de produção usando node app.js.
Para executar o servidor no modo de desenvolvimento, execute npm run dev.

Para compilar e executar o servidor no modo de produção, execute npm run build seguido por npm run start.

Endpoints da API
O servidor expõe os seguintes endpoints:

GET /: Retorna uma mensagem de boas-vindas para a Leads API.
POST /leads: Aceita um array de leads com as propriedades id, email e nome. Armazena os leads no Google BigQuery.
Validação de Dados
A validação de dados é feita usando a biblioteca de validação de esquemas Zod. O objeto WebhookDataSchema é usado para validar o corpo da solicitação do endpoint /leads.

Integração com o Google BigQuery
O servidor utiliza o pacote @google-cloud/bigquery para interagir com o Google BigQuery. Os dados dos leads são armazenados na tabela leads_table sob o conjunto de dados teste.

Tratamento de Erros
O tratamento de erros é feito usando as capacidades de tratamento de erros do Fastify. Erros de validação são registrados e respondidos com um código de status 400, enquanto outros erros são registrados e respondidos com um código de status 500.
