export const delay = async function (ms: number): Promise<void> {
  console.info(`Delay ${ms}ms`);
  return new Promise(resolve => setTimeout(resolve, ms));
};
