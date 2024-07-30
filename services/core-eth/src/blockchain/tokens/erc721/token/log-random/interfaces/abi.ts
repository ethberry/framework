import { Interface } from "ethers";

import ERC721BlacklistDiscreteRentableRandomBesuSol from "@framework/core-contracts/artifacts/contracts/ERC721/random/ERC721BlacklistDiscreteRandomGemunionBesu.sol/ERC721BlacklistDiscreteRandomGemunionBesu.json";
// TODO add setVrfSubs. abi here
export const ABIRandom = new Interface(ERC721BlacklistDiscreteRentableRandomBesuSol.abi);
