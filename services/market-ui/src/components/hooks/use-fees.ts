import { constants } from "ethers";

import { IErc721Token } from "@framework/types";
// import { useRoyalty } from "./use-royalty";

export const DEFAULT_BESU_ACCOUNT = "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";
export const GEMUNION_SHARES_ADDR = constants.AddressZero;

export const useFees = (_erc721: IErc721Token) => {
  const fees = [];

  // const royalty = useRoyalty(erc721);
  //
  // if (royalty.basisPoints > 0 && royalty.basisPoints < 1_000) {
  //   fees.push(royalty);
  // }

  fees.push({
    recipient: process.env.ACCOUNT,
    basisPoints: 500,
  });

  if (process.env.ACCOUNT !== DEFAULT_BESU_ACCOUNT) {
    fees.push({
      recipient: GEMUNION_SHARES_ADDR,
      basisPoints: 100,
    });
  }

  return fees;
};
