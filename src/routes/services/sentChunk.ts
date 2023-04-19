import { BigQuery } from '@google-cloud/bigquery';
import { auth } from '../../auth';
import { db_bigQuerySchema } from '../../schema';
import { coreDataBuffer } from './leadFilter';
import { getExistingLeadIdsInBigQuery } from './leadExistence';
import { createTableIfNotExists } from './tableHandle';

// This function handles sending the unique leads to BigQuery
export const sentChunk = async () => {
  try {
    // Initialize the BigQuery client
    const bigqueryClient = new BigQuery(auth);

    // Access the dataset
    const db_dataset = bigqueryClient.dataset('teste');

    // Create the table if it doesn't exist
    const db_table = await createTableIfNotExists(
      db_dataset,
      'clientes',
      db_bigQuerySchema
    );

    // If there are leads in the coreDataBuffer
    if (coreDataBuffer.length > 0) {
      // Get the leadIds from coreDataBuffer
      const leadIds = coreDataBuffer.map((coreData) => coreData.id);

      // Get the existing lead IDs from BigQuery
      const existingLeadIds = await getExistingLeadIdsInBigQuery(
        bigqueryClient,
        db_dataset,
        db_table,
        leadIds
      );

      // Filter the leads that are not in the existing leads in BigQuery
      const uniqueCoreDataList = coreDataBuffer.filter(
        (coreData) => !existingLeadIds.includes(coreData.id)
      );

      // Insert the unique leads to BigQuery
      await db_table.insert(uniqueCoreDataList);
      console.log('Dados armazenados no Big Query', uniqueCoreDataList);

      // Clear the coreDataBuffer
      coreDataBuffer.length = 0;
    }
  } catch (error) {
    console.error('Erro ao enviar dados para o Big Query:', error);
  }
};
