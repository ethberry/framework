export const uniqueBy = <T extends Record<string, any> = Record<string, any>>(
  array: T[],
  by: string | string[],
): T[] => {
  const uniqueArray: T[] = [];

  array.forEach(item => {
    const found = uniqueArray.find(it => {
      if (Array.isArray(by)) {
        return by.every(b => it[b] === item[b]);
      }
      return it[by] === item[by];
    });
    if (!found) {
      uniqueArray.push(item);
    }
  });

  return uniqueArray;
};
