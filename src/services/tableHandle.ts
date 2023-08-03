import { Table } from '@google-cloud/bigquery';
import { logger } from './logger';
import { db_dataset } from '../helpers/auth';
import { db_clienteSchema, db_tempSchema } from '../helpers/schema';

// Define variables to hold table references
export let db_table: Table;
export let tempTable: Table;

// Function to create a table if it doesn't exist
async function createTableIfNotExists(
  tableName: string,
  schema: { name: string; type: string; mode: string }[],
  maxRetries: number = 3,
): Promise<Table> {
  const table = db_dataset.table(tableName);

  const delay = (ms: number): Promise<void> => new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const [exists] = await table.exists();

      if (!exists) {
        const [createdTable] = await db_dataset.createTable(tableName, {
          schema,
        });

        console.log(`Tabela ${tableName} criada`);
        await delay(5000); // Wait for 5 seconds before proceeding

        return createdTable;
      }
      return table;
    } catch (error) {
      if (attempt === maxRetries) {
        logger.error(
          `Failed to create table ${tableName} after ${maxRetries} attempts.`,
        );

        throw error;
      } else {
        console.warn(
          `Attempt ${attempt} to create table ${tableName} failed. Retrying...`,
        );

        await delay(1000 * attempt); // Wait for an increasing delay before retrying
      }
    }
  }

  throw new Error(
    `Failed to create or access table ${tableName} after ${maxRetries} attempts.`,
  );
}

// Function to handle table creation
export async function tableHandle() {
  // Create or get the 'clientes' table using the specified schema
  db_table = await createTableIfNotExists('clientes', db_clienteSchema);

  // Create or get the 'temp_updated_leads' table using the specified schema
  tempTable = await createTableIfNotExists('temp_updated_leads', db_tempSchema);
}
