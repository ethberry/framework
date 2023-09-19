import { Interface } from "ethers";

import ERC721BlacklistDiscreteRentableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721BlacklistDiscreteRentableRandom.sol/ERC721BlacklistDiscreteRentableRandom.json";

export const ABIRandom = new Interface(ERC721BlacklistDiscreteRentableRandomSol.abi);
