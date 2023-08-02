import { BigQuery, Dataset, Table } from '@google-cloud/bigquery';
import { LeadSearched } from '../../helpers/interfaces';

// Function to retrieve old rows from the main table
export async function getOldRowsFromMain(
  bigqueryClient: BigQuery,
  db_dataset: Dataset,
  db_table: Table,
  coreDataiDS: string[]
): Promise<Array<{ id: string }>> {
  const queryOldRowsFromMain = `
        SELECT id
        FROM \`${db_dataset.id}.${db_table.id}\`
        WHERE TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), timestamp, MINUTE) >= 90 AND id IN UNNEST(@id)
      `;

  const [oldRowsFromMain] = await bigqueryClient.query({
    query: queryOldRowsFromMain,
    params: {
      id: coreDataiDS,
    },
  });

  return oldRowsFromMain;
}

// Function to retrieve old rows from the temporary table based on lead IDs
export async function getOldRowsFromTemp(
  bigqueryClient: BigQuery,
  db_dataset: Dataset,
  tempTable: Table,
  avaliableIDs: string[],
  coreDataIds: string[]
): Promise<{
  availableOldRowsFromTemp: LeadSearched[];
  allOldRowsFromTemp: string[];
}> {
  const queryAllOldRowsFromTemp = `
      SELECT id
      FROM \`${db_dataset.id}.${tempTable.id}\`
      WHERE id IN UNNEST(@coreDataIds)
    `;

  const queryAvailableOldRowsFromTemp = `
      SELECT *
      FROM \`${db_dataset.id}.${tempTable.id}\`
      WHERE id IN UNNEST(@leadIds)
    `;

  const optionsAllOldRowsFromTemp = {
    query: queryAllOldRowsFromTemp,
    params: {
      coreDataIds: coreDataIds,
    },
  };

  const optionsAvailableOldRowsFromTemp = {
    query: queryAvailableOldRowsFromTemp,
    params: {
      leadIds: avaliableIDs,
    },
  };

  const allOldRowsFromTemp = coreDataIds.length
    ? await bigqueryClient.query(optionsAllOldRowsFromTemp)
    : [[]];
  const availableOldRowsFromTemp = avaliableIDs.length
    ? await bigqueryClient.query(optionsAvailableOldRowsFromTemp)
    : [[]];

  return {
    availableOldRowsFromTemp: availableOldRowsFromTemp[0] as LeadSearched[],
    allOldRowsFromTemp: allOldRowsFromTemp[0] as string[],
  };
}
