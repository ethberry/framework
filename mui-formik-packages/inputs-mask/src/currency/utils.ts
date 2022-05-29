export const getFormattedCurrency = (value: string): number => Number.parseFloat(value) * 100;

export const getNormalCurrency = (value: number): string => (value ? (value / 100).toString() : "0");
