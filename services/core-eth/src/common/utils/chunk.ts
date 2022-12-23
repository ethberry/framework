export const chunk = <T>(array: Array<T>, size = 1): Array<Array<T>> => {
  const arrayChunks: Array<Array<T>> = [];
  for (let pointer = 0; pointer < array.length; pointer += size) {
    arrayChunks.push(array.slice(pointer, pointer + size));
  }
  return arrayChunks;
};
