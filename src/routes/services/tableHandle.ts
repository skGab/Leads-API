// Import required classes from the BigQuery library
import { Dataset, Table } from '@google-cloud/bigquery';

/**
 * Creates a delay for a given duration.
 * @param {number} ms - The duration of the delay in milliseconds.
 * @return {Promise<void>} A promise that resolves after the given duration.
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Creates a BigQuery table if it doesn't exist and returns the table.
 * @param {Dataset} dataset - The BigQuery dataset instance.
 * @param {string} tableName - The name of the table to be created.
 * @param {{name: string; type: string; mode: string}[]} schema - The schema of the table to be created.
 * @param {number} [maxRetries=3] - The maximum number of retries allowed before throwing an error.
 * @return {Promise<Table>} A promise that resolves to the created or existing table.
 * @throws Will throw an error if the table can't be created or accessed after the maximum number of retries.
 */
export async function createTableIfNotExists(
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
        await delay(5000); // Wait for 5 seconds before proceeding
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
