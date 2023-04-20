// Import required dependencies
import { z } from 'zod';
import { CoreDataItem, leadSchema } from '../../schema';

// Define the Lead type based on the client schema
type Lead = z.infer<typeof leadSchema>['leads'][number];

interface LeadFilterResult {
  coreData: CoreDataItem;
  otherData: { [x: string]: any };
}

/**
 * Filters and separates the given lead object into core data and other data.
 * @param {Lead} lead - The lead object to be filtered.
 * @return {LeadFilterResult} An object containing coreData and otherData properties.
 */
export const leadFilter = (lead: Lead): LeadFilterResult => {
  // Initialize coreData and otherData objects
  const coreData: { [x: string]: any } = {};
  const otherData: { [x: string]: any } = {
    first_conversion: null,
    last_conversion: null,
    tags: null,
    custom_fields: null,
  };

  // Iterate through the lead object keys
  Object.entries(lead).forEach(([key, value]) => {
    // Check if the key should be included in otherData
    if (
      ['first_conversion', 'last_conversion', 'tags', 'custom_fields'].includes(
        key
      )
    ) {
      otherData[key] = value;
    } else {
      // Include the key in coreData, with 'não preenchido' as the default value if value is null
      coreData[key] = value === null ? 'não preenchido' : value;
    }
  });

  // Return the filtered data as an object with coreData and otherData properties
  return { coreData: coreData as CoreDataItem, otherData };
};
