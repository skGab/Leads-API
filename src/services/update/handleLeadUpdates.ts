import { BigQuery, Dataset, Table } from '@google-cloud/bigquery';
import { LeadSearched } from '../../helpers/interfaces';
import { deleteOldRowsFromTemp } from '../delete/deleteOldRows';
import { getOldRowsFromMain, getOldRowsFromTemp } from '../get/getOldRows';
import { insertUpdatedData } from './insertUpdatedData';
import { updateLeads } from './updateData';

export default async function handleLeadUpdates(
  bigqueryClient: BigQuery,
  db_dataset: Dataset,
  db_table: Table,
  tempTable: Table,
  mergedUpdatedDataBuffer: LeadSearched[],
) {
  // Function to retrieve old rows from the main table
  const coreDataIds = mergedUpdatedDataBuffer.map((lead) => lead.id);

  const oldRowsFromMain = await getOldRowsFromMain(
    bigqueryClient,
    db_dataset,
    db_table,
    coreDataIds,
  );
  const avaliableIDs = oldRowsFromMain.map((lead) => lead.id);

  console.log(
    'Linhas antigas da tabela principal prontas para atualização:',
    avaliableIDs,
  );
  console.log('---------------------------------------');

  // Function to retrieve old rows from the temporary table based on lead IDs
  const { availableOldRowsFromTemp, allOldRowsFromTemp } = await getOldRowsFromTemp(
    bigqueryClient,
    db_dataset,
    tempTable,
    avaliableIDs,
    coreDataIds,
  );

  console.log(
    'Dados pegos da tabela temporaria e prontos para atualização:',
    availableOldRowsFromTemp,
  );

  if (availableOldRowsFromTemp.length > 0) {
    // Replace the old data in oldRowsFromTemp with the new data from mergedUpdatedDataBuffer if there's a match in the id
    const updatedRowsFromTemp = availableOldRowsFromTemp.map((oldRow) => {
      const newData = mergedUpdatedDataBuffer.find(
        (newRow) => newRow.id === oldRow.id,
      );

      return newData || oldRow;
    });

    // Function to update existing leads in the main table
    await updateLeads(
      bigqueryClient,
      db_dataset,
      db_table,
      updatedRowsFromTemp,
    );
    console.log('Leads atualizados no BigQuery', updatedRowsFromTemp);
    console.log('---------------------------------------');

    // Function to delete old rows from the temporary table
    await deleteOldRowsFromTemp(
      bigqueryClient,
      db_dataset,
      tempTable,
      updatedRowsFromTemp,
    );
    console.log('Dados antigos removidos da tabela temporária');
    console.log('---------------------------------------');
  }

  // Find the leads in the mergedUpdatedDataBuffer that also exist in leadIdsMain
  const leadsToUpdate = mergedUpdatedDataBuffer.filter((lead) => avaliableIDs.includes(lead.id));

  if (leadsToUpdate.length > 0) {
    // Function to update existing leads in the main table
    await updateLeads(bigqueryClient, db_dataset, db_table, leadsToUpdate);
    console.log('Leads atualizados no BigQuery', leadsToUpdate);
    console.log('---------------------------------------');
  } else {
    // Find the leads that are not in the temp table
    const leadsToTemp = mergedUpdatedDataBuffer.filter(
      (lead) => allOldRowsFromTemp.includes(lead.id) || avaliableIDs.includes(lead.id),
    );

    if (leadsToTemp.length > 0) {
      // Function to insert updated data into the temporary table
      await insertUpdatedData(tempTable, leadsToTemp);
      console.log('Dados armazenados na tabela temporária', leadsToTemp);
      console.log('---------------------------------------');
    } else {
      console.log('Dados já na fila de atualização');
      console.log('---------------------------------------');
    }
  }
}
