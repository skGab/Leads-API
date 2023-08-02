import { Table } from "@google-cloud/bigquery";
import { LeadSearched } from "../../helpers/interfaces";

// Function to insert updated data into the temporary table
export async function insertUpdatedData(
  tempTable: Table,
  newLeadIds: LeadSearched[]
) {
  const updatedCoreDataListWithTimestamp = newLeadIds.map((data: any) => ({
    ...data,
    timestamp: new Date(),
  }));
  await tempTable.insert(updatedCoreDataListWithTimestamp);
}
