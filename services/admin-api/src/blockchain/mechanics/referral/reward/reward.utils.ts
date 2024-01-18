import { formatUnits } from "ethers";

export const formatEther = (amount = "0", decimals = 18, currency = "Ξ"): string => {
  return `${currency} ${formatUnits(amount, decimals)}`;
};
