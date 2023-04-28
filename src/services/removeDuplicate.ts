import { CoreData } from '../interfaces';

/**
 * Removes duplicate entries from the provided data buffer based on their 'id' property.
 * @param {CoreData} dataBuffer - The data buffer containing the CoreData items to be filtered.
 * @return {CoreData} A new data buffer with duplicate entries removed.
 */
export function removeDuplicateIds(dataBuffer: CoreData): CoreData {
  // Initialize a new filtered data buffer and a Set to store unique ids
  const filteredDataBuffer: CoreData = [];
  const idSet = new Set();

  // Iterate through the data buffer in reverse order
  for (let i = dataBuffer.length - 1; i >= 0; i--) {
    const coreData = dataBuffer[i];

    // If the idSet does not contain the current 'id', add the coreData to the filtered buffer
    if (!idSet.has(coreData.id)) {
      idSet.add(coreData.id);
      filteredDataBuffer.unshift(coreData);
    }
  }

  // Return the filtered data buffer with duplicates removed
  return filteredDataBuffer;
}
