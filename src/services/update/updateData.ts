import { BigQuery, Dataset, Table } from '@google-cloud/bigquery';
import { LeadSearched } from '../../helpers/interfaces';

// Function to update existing leads in the main table
export async function updateLeads(
  bigqueryClient: BigQuery,
  db_dataset: Dataset,
  db_table: Table,
  oldRowsFromTemp: LeadSearched[],
) {
  for (const lead of oldRowsFromTemp) {
    const queryUpdate = `
      UPDATE \`${db_dataset.id}.${db_table.id}\`
      SET opportunity = @opportunity, lead_stage = @lead_stage
      WHERE id = @id
    `;
    const options = {
      query: queryUpdate,
      params: {
        id: lead.id,
        opportunity: lead.opportunity,
        lead_stage: lead.lead_stage,
      },
    };
    await bigqueryClient.query(options);
  }
}
