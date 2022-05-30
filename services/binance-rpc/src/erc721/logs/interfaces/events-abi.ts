import { AbiItem } from "web3-utils";

import ERC721GradedSol from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Graded.sol/ERC721Graded.json";
// import ERC721RandomSol from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";
import ERC721RandomTestSol from "@framework/binance-contracts/artifacts/contracts/ERC721/test/ERC721RandomTest.sol/ERC721RandomTest.json";
import ERC721SimpleSol from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";

export const ERC721FullEvents = Object.values(
  ([] as Array<AbiItem>)
    // @ts-ignore
    .concat(ERC721SimpleSol.abi, ERC721GradedSol.abi, ERC721RandomTestSol.abi)
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
