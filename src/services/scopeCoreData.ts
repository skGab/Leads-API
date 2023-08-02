// Import required dependencies
import { CoreDataItem, Lead, LeadFilterResult } from '../helpers/interfaces';

// Define a function to convert the value based on the schema
const convertValue = (key: string, value: unknown): any => {
  switch (key) {
    case 'created_at':
    case 'last_marked_opportunity_date':
      return value ? new Date(value as string) : null;
    case 'opportunity':
      return value === 'true' || value === true;
    case 'number_conversions':
      return value ? parseFloat(value as string) : null;
    default:
      return value === null || value === '' ? 'não preenchido' : value;
  }
};

/**
 * Filters and separates the given lead object into core data and other data.
 * @param {Lead} lead - The lead object to be filtered.
 * @return {LeadFilterResult} An object containing coreData and otherData properties.
 */

// Define the Lead type based on the client schema
export const scopeCoreData = (lead: Lead): LeadFilterResult => {
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
      coreData[key] = convertValue(key, value);
    }
  });

  // Return the filtered data as an object with coreData and otherData properties
  return {
    coreData: { ...coreData, timestamp: new Date() } as CoreDataItem,
    otherData,
  };
};
