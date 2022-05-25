import { AbiItem } from "web3-utils";

import CliffVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/CliffVesting.sol/CliffVesting.json";
import GradedVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/GradedVesting.sol/GradedVesting.json";
import LinearVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/LinearVesting.sol/LinearVesting.json";

export const ERC20VestingFullEvents = Object.values(
  ([] as Array<AbiItem>)
    // @ts-ignore
    .concat(CliffVesting.abi, GradedVesting.abi, LinearVesting.abi)
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
