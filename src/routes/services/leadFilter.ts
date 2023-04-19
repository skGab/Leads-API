import { z } from 'zod';
import { clientSchema } from '../../schema';

type Lead = z.infer<typeof clientSchema>['leads'][number];
export const coreDataBuffer: Array<any> = [];

// FILTER
export const leadFilter = (lead: Lead) => {
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
      coreData[key] = value === null ? 'não preenchido' : value;
    }
  });

  return { coreData, otherData };
};
