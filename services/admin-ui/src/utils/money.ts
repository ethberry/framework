import { constants, ethers } from "ethers";

export const formatMoney = (amount = "0", currency = constants.EtherSymbol): string => {
  return `${currency} ${ethers.utils.formatEther(amount)}`;
};
