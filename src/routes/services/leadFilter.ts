import { z } from 'zod';
import { clientSchema, db_bigQuerySchema } from '../../schema';
import { BigQuery, Dataset, Table } from '@google-cloud/bigquery';
import { auth } from '../../auth';

type Lead = z.infer<typeof clientSchema>['leads'][number];
export const coreDataBuffer: Array<any> = [];

// FILTER
export const leadFilter = (lead: Lead) => {
  const coreData: { [x: string]: any } = {};
  const otherData: { [x: string]: any } = {
    first_conversion: null,
    last_conversion: null,
    tags: null,
    custom_fields: null,
  };

  // Iterate through the lead object keys
  Object.entries(lead).forEach(([key, value]) => {
    // Check if the key should be included in otherData
    if (
      ['first_conversion', 'last_conversion', 'tags', 'custom_fields'].includes(
        key
      )
    ) {
      otherData[key] = value;
    } else {
      coreData[key] = value === null ? 'não preenchido' : value;
    }
  });

  return { coreData, otherData };
};

// DELAY
const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// CHECKING DB
async function createTableIfNotExists(
  dataset: Dataset,
  tableName: string,
  schema: { name: string; type: string; mode: string }[],
  maxRetries: number = 3
): Promise<Table> {
  const table = dataset.table(tableName);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const [exists] = await table.exists();

      if (!exists) {
        const [createdTable] = await dataset.createTable(tableName, { schema });
        console.log(`Tabela ${tableName} criada`);
        await delay(1000); // Wait for 1 second before proceeding
        return createdTable;
      } else {
        return table;
      }
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(
          `Failed to create table ${tableName} after ${maxRetries} attempts.`
        );
        throw error;
      } else {
        console.warn(
          `Attempt ${attempt} to create table ${tableName} failed. Retrying...`
        );
        await delay(1000 * attempt); // Wait for an increasing delay before retrying
      }
    }
  }

  throw new Error(
    `Failed to create or access table ${tableName} after ${maxRetries} attempts.`
  );
}

// STORING DATA BEFORE SENDING
export const sentChunk = async () => {
  try {
    const bigqueryClient = new BigQuery(auth);
    const db_dataset = bigqueryClient.dataset('teste');
    const db_table = await createTableIfNotExists(
      db_dataset,
      'clientes',
      db_bigQuerySchema
    );

    // ON THIS FLUSHBUFFER I NEED TO CHECK THE CORE_DATA_ARRAY FOR CLIENTES THA IS ALREADY STORE ON THE TABLE
    // NEED TO TCHECK ONLY IF THE TABLE IS ALREADY CREATED
    // IF THE CLIENTE IS ALREADY STORE, I NEED TO VERIFY THE KEYS OPPORTUNITY AND UPDATED IT 

    if (coreDataBuffer.length > 0) {
      await db_table.insert(coreDataBuffer);
      console.log('Dados armazenados no Big Query', coreDataBuffer);
      coreDataBuffer.length = 0;
    }
  } catch (error) {
    console.error('Erro ao enviar dados para o Big Query:', error);
  }
};
