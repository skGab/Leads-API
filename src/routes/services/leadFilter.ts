import { z } from 'zod';
import { clientSchema } from '../../schema';

export const coreData: { [x: string]: any }[] = [];
export const otherData: { [x: string]: any }[] = [];

type Lead = z.infer<typeof clientSchema>['leads'][number];

export const leadFilter = (leads: Lead[]) => {
  leads.forEach((lead) => {
    // Filter the keys in the lead object to only include keys with string or null values
    const filteredKeys = Object.entries(lead).filter(([key, value]) => {
      return typeof value === 'string' || value === null;
    });

    // Convert the filtered key-value pairs back into an object and replace null with "não preenchido"
    const filteredLead = Object.fromEntries(
      filteredKeys.map(([key, value]) => [
        key,
        value === null ? 'não preenchido' : value,
      ])
    );

    coreData.push(filteredLead);

    // Store the ignored objects
    const ignoredKeys = Object.entries(lead).filter(([key, value]) => {
      return typeof value === 'object' && value !== null;
    });

    if (ignoredKeys.length > 0) {
      const ignoredObj = Object.fromEntries(ignoredKeys);
      otherData.push(ignoredObj);
    }
  });
};
