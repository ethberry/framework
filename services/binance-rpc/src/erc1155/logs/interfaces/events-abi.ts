import { AbiItem } from "web3-utils";

import ERC1155Simple from "@framework/binance-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";

export const ERC1155FullEvents = Object.values(
  ([] as Array<AbiItem>)
    // @ts-ignore
    .concat(ERC1155Simple.abi)
    .filter(el => {
      return el.type === "event";
    })
    .reduce((memo, current) => {
      if (current.name && !(current.name in memo)) {
        memo[current.name] = current;
      }
      return memo;
    }, {} as Record<string, AbiItem>),
);
