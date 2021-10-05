export const formatMoney = (amount = 0, currency = "$"): string => {
  return `${(amount === 0 ? amount : amount / 100).toFixed(2)}${currency}`;
};
