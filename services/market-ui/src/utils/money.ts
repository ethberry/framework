import { utils } from "ethers";

export const formatEther = (amount = "0", currency = "Ξ"): string => {
  return `${currency}${utils.formatEther(amount)}`;
};

export const formatMoney = (amount = 0, currency = "$"): string => {
  return `${currency}${amount.toFixed(2)}`;
};
