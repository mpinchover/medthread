export const stringSplitIntoBatches = (
  items: string[],
  batchSize: number
): string[][] => {
  const copyOfItems = items.slice();
  const batches: string[][] = [];

  while (copyOfItems.length > 0) {
    const batch = copyOfItems.splice(0, batchSize);
    batches.push(batch);
  }

  return batches;
};
