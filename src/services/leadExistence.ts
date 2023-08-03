// Import required classes from the BigQuery library
import { BigQuery, Dataset, Table } from '@google-cloud/bigquery';
import { LeadSearched } from '../helpers/interfaces';

/**
 * Check the existence of leads in the BigQuery table and returns the list of existing lead IDs.
 * @param {BigQuery} bigqueryClient - The BigQuery client instance.
 * @param {Dataset} dataset - The dataset ID in BigQuery.
 * @param {Table} table - The table ID in BigQuery.
 * @param {string[]} leadIds - An array of lead IDs to check for existence.
 * @return {Promise<string[]>} A promise that resolves to an array of existing lead IDs.
 */

export async function getExistingLeadIdsInBigQuery(
  bigqueryClient: BigQuery,
  dataset: Dataset,
  table: Table,
  leadIds: string[],
  chunkSize: number = 1000, // Adjust this value as needed
): Promise<LeadSearched[]> {
  const existingLeadIds: LeadSearched[] = [];

  for (let i = 0; i < leadIds.length; i += chunkSize) {
    const leadIdsChunk = leadIds.slice(i, i + chunkSize);
    const leadIdsString = leadIdsChunk.map((id) => `'${id}'`).join(', ');

    const query = `SELECT id, opportunity, lead_stage, timestamp FROM \`${dataset.id}.${table.id}\` WHERE id IN (${leadIdsString})`;

    const [rows] = await bigqueryClient.query({ query });

    existingLeadIds.push(
      ...rows.map((row) => ({
        id: row.id,
        opportunity: row.opportunity,
        lead_stage: row.lead_stage,
        timestamp: row.timestamp.value,
      })),
    );
  }

  return existingLeadIds;
}
