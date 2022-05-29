import { AbiItem } from "web3-utils";

import ERC20Simple from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC20BlackList from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20BlackList.sol/ERC20BlackList.json";

export const ERC20FullEvents = Object.values(
  ([] as Array<AbiItem>)
    // @ts-ignore
    .concat(ERC20Simple.abi, ERC20BlackList.abi)
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
