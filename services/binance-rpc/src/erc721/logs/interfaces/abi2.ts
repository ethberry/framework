import { AbiItem } from "web3-utils";

import ERC721Graded from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Graded.sol/ERC721Graded.json";
import ERC721Random from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";
import ERC721Simple from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
// import ERC721Airdrop from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Airdrop.sol/ERC721Airdrop.json";
// import ERC721Dropbox from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Dropbox.sol/ERC721Dropbox.json";

export const ERC721FullEvents = Object.values(
  ([] as Array<AbiItem>)
    // @ts-ignore
    .concat(ERC721Simple.abi, ERC721Graded.abi, ERC721Random.abi)
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
