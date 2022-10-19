import { BigNumber, utils } from "ethers";

import { IToken } from "../provider";

export const safeParseUnits = (tokenQuantity: string, fromToken: IToken): BigNumber => {
  if (!tokenQuantity) {
    return BigNumber.from("0");
  }
  let [intToSend, decimalsToSend] = tokenQuantity.split(".");
  if (decimalsToSend && decimalsToSend.length > fromToken.decimals) {
    decimalsToSend = decimalsToSend.slice(0, fromToken.decimals);
    if (decimalsToSend.length) {
      tokenQuantity = [intToSend, decimalsToSend].join(".");
    } else {
      tokenQuantity = intToSend;
    }
  }
  return utils.parseUnits(
    // Formats number to prevent error
    tokenQuantity,
    BigNumber.from(fromToken.decimals),
  );
};
