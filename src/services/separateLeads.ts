import { CoreData, LeadSearched } from '../helpers/interfaces';

export default function separateLeads(
  filteredDataBuffer: CoreData,
  existingLeadData: LeadSearched[],
): { uniqueCoreDataList: CoreData; updatedCoreDataList: LeadSearched[] } {
  const uniqueCoreDataList: CoreData = [];
  const updatedCoreDataList: LeadSearched[] = [];

  // Separate leads that need to be inserted and updated
  filteredDataBuffer.forEach((coreData) => {
    const existingLead = existingLeadData.find(
      (lead) => lead.id === coreData.id,
    );
    if (existingLead) {
      // Compare opportunity and lead_stage fields, and add to updatedCoreDataList if they are different
      if (
        existingLead.opportunity !== coreData.opportunity
        || existingLead.lead_stage !== coreData.lead_stage
      ) {
        updatedCoreDataList.push({
          id: coreData.id,
          opportunity: coreData.opportunity,
          lead_stage: coreData.lead_stage,
          timestamp: coreData.timestamp,
        });

        // DEBUGGING
        console.log(
          `O Lead ${coreData.name} está com campos diferentes e foi adicionado na fila de atualizações`,
        );
        console.log('Novos campos:', {
          opportunity: coreData.opportunity,
          lead_stage: coreData.lead_stage,
        });
        console.log('Campos atuais:', {
          opportunity: existingLead.opportunity,
          lead_stage: existingLead.lead_stage,
        });
        console.log('---------------------------------------');
        // END DEBUGGING
      }
    } else {
      uniqueCoreDataList.push(coreData);
    }
  });

  return { uniqueCoreDataList, updatedCoreDataList };
}
