import { ethers } from "ethers";

export const formatMoney = (amount = "0", currency = "Ξ"): string => {
  return `${currency}${ethers.utils.formatEther(amount)}`;
};
