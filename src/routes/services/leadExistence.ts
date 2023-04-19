import { BigQuery, Dataset, Table } from "@google-cloud/bigquery";

// CHECKING LEAD EXISTENCE
export async function getExistingLeadIdsInBigQuery(
    bigqueryClient: BigQuery,
    datasetId: Dataset,
    tableId: Table,
    leadIds: string[]
  ): Promise<string[]> {
    const leadIdsString = leadIds.map((id) => `'${id}'`).join(', ');
    const query = `SELECT id FROM \`${datasetId}.${tableId}\` WHERE id IN (${leadIdsString})`;
  
    const [rows] = await bigqueryClient.query({ query });
  
    return rows.map((row) => row.id);
  }