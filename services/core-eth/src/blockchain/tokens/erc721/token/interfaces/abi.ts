import { Interface } from "ethers";

import ERC721BlacklistDiscreteRentableSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721BlacklistDiscreteRentable.sol/ERC721BlacklistDiscreteRentable.json";
import ERC721BlacklistDiscreteRentableRandomBesuSol from "@framework/core-contracts/artifacts/contracts/ERC721/random/ERC721BlacklistDiscreteRandomGemunionBesu.sol/ERC721BlacklistDiscreteRandomGemunionBesu.json";

export const Erc721ABI = new Interface(ERC721BlacklistDiscreteRentableSol.abi);
export const Erc721ABIRandom = new Interface(ERC721BlacklistDiscreteRentableRandomBesuSol.abi);
