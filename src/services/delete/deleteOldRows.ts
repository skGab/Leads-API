import { BigQuery, Dataset, Table } from '@google-cloud/bigquery';
import { LeadSearched } from '../../helpers/interfaces';

// Function to delete old rows from the temporary table
export async function deleteOldRowsFromTemp(
  bigqueryClient: BigQuery,
  db_dataset: Dataset,
  tempTable: Table,
  updatedRowsFromTemp: LeadSearched[],
) {
  for (const lead of updatedRowsFromTemp) {
    const queryDelete = `
        DELETE FROM \`${db_dataset.id}.${tempTable.id}\`
        WHERE id = @id
      `;
    const options = {
      query: queryDelete,
      params: {
        id: lead.id,
      },
    };
    await bigqueryClient.query(options);
  }
}
