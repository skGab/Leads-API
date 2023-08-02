import { CoreData, LeadSearched } from '../helpers/interfaces';

/**
 * This function receives the failed data and the new data and returns both merged.
 */
export default function mergeFailedData(
  uniqueCoreDataList: CoreData,
  updatedCoreDataList: LeadSearched[],
  failedUniqueDataBuffer: CoreData,
  failedUpdatedDataBuffer: LeadSearched[]
): {
  mergedUniqueDataBuffer: CoreData;
  mergedUpdatedDataBuffer: LeadSearched[];
} {
  // Merging failed unique data with the new unique data
  const mergedUniqueDataBuffer = [
    ...failedUniqueDataBuffer,
    ...uniqueCoreDataList,
  ];

  // Merging the failed data to update
  const mergedUpdatedDataBuffer = [
    ...failedUpdatedDataBuffer,
    ...updatedCoreDataList,
  ];

  return { mergedUniqueDataBuffer, mergedUpdatedDataBuffer };
}
