import {
  BigQuery,
  Dataset,
  InsertRowsResponse,
  Table,
} from '@google-cloud/bigquery';
import { getExistingLeadIdsInBigQuery } from './leadExistence';
import separateLeads from './separateLeads';
import updateExistingLeads from './handleLeadUpdates';
import { removeDuplicateIds } from './removeDuplicate';
import {
  CoreData,
  ExtendedInsertRowsResponse,
  LeadSearched,
} from '../interfaces';
import mergeFailedData from './mergeFailedData';

export const sentStreaming = async (
  dataBuffer: CoreData,
  db_dataset: Dataset,
  db_table: Table,
  tempTable: Table,
  bigqueryClient: BigQuery,
  failedUniqueDataBuffer: CoreData,
  failedUpdatedDataBuffer: LeadSearched[]
): Promise<void> => {
  // Remove duplicate IDs from dataBuffer, keeping only the last object
  const filteredDataBuffer = removeDuplicateIds(dataBuffer);

  console.log(
    'Leads duplicados removidos, leads unicos:',
    filteredDataBuffer.length
  );
  console.log('---------------------------------------');

  // Get the leadIds from dataBuffer
  const leadIds = filteredDataBuffer.map((coreData) => coreData.id);

  console.log('Ids from dataBuffer:', leadIds);
  console.log('---------------------------------------');

  // Get the existing lead IDs from BigQuery
  const existingLeadsData = await getExistingLeadIdsInBigQuery(
    bigqueryClient,
    db_dataset,
    db_table,
    leadIds
  );

  console.log('Leads existentes do BigQuery:', existingLeadsData);
  console.log('---------------------------------------');

  // Separate leads that need to be inserted and updated
  const { uniqueCoreDataList, updatedCoreDataList } = separateLeads(
    filteredDataBuffer,
    existingLeadsData
  );

  console.log('Leads na fila de não repetidos:', uniqueCoreDataList.length);
  console.log('Leads na fila de atualização:', updatedCoreDataList);
  console.log('---------------------------------------');

  // Create an array of promises
  const promises: (Promise<void> | Promise<InsertRowsResponse>)[] = [];

  console.log('dados prontos para inserção:', uniqueCoreDataList.length);
  console.log('---------------------------------------');
  console.log('dados prontos para atualização:', updatedCoreDataList);
  console.log('---------------------------------------');

  // Insert the unique leads to BigQuery
  if (uniqueCoreDataList.length > 0) {
    promises.push(db_table.insert(uniqueCoreDataList));
  }

  // Update the existing leads with changed fields in BigQuery
  if (updatedCoreDataList.length > 0) {
    promises.push(
      updateExistingLeads(
        bigqueryClient,
        db_dataset,
        db_table,
        tempTable,
        updatedCoreDataList
      )
    );
  }

  // Wait for all promises to complete and return the result
  return Promise.all(promises)
    .then(() => {
      // Clear the dataBuffer here, after sentStreaming is called
      dataBuffer.length = 0;
    })
    .catch((error) => {
      console.error('Error when inserting or updating data:', error);

      // If you want to propagate the specific errors to the client route when one of the promises fails
      throw error;
    });
};
