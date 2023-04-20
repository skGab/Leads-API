import { BigQuery, Dataset } from '@google-cloud/bigquery';
import { CoreData, db_bigQuerySchema } from '../../schema';
import { getExistingLeadIdsInBigQuery } from './leadExistence';
import { createTableIfNotExists } from './tableHandle';

/**
 * This function sends unique leads from the clienteBuffer to BigQuery.
 */

export const sentChunk = async (
  dataBuffer: CoreData,
  db_dataset: Dataset,
  bigqueryClient: BigQuery
) => {
  try {
    // Create the table if it doesn't exist
    const db_table = await createTableIfNotExists(
      db_dataset,
      'clientes',
      db_bigQuerySchema
    );

    console.log('Leads recebidos:', dataBuffer.length);

    // Get the leadIds from dataBuffer
    const leadIds = dataBuffer.map((coreData) => coreData.id);

    // Get the existing lead IDs from BigQuery
    const existingLeadIds = await getExistingLeadIdsInBigQuery(
      bigqueryClient,
      db_dataset,
      db_table,
      leadIds
    );

    let uniqueCoreDataList = dataBuffer;

    // Filter the leads that are not in the existing leads in BigQuery
    if (existingLeadIds.length > 0) {
      uniqueCoreDataList = dataBuffer.filter(
        (coreData) => !existingLeadIds.includes(coreData.id)
      );
    }

    // Insert the unique leads to BigQuery
    if (uniqueCoreDataList.length > 0) {
      await db_table.insert(uniqueCoreDataList);
      console.log('Leads armazenados no BigQuery', uniqueCoreDataList.length);
      console.log('Leads que foram dispensados', existingLeadIds.length);
      console.log('Leads que foram dispensados', existingLeadIds);
    } else {
      console.log('Leads já inseridos no BigQuery', existingLeadIds.length);
      console.log('Leads já inseridos no BigQuery', existingLeadIds);
    }

    // Clear the clienteBuffer
    dataBuffer.length = 0;
  } catch (error) {
    console.error('Erro ao enviar dados para o Big Query:', error);
  }
};
