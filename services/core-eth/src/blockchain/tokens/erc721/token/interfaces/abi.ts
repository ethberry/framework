import { Interface } from "ethers";

import ERC721BlacklistDiscreteRentableSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721BlacklistDiscreteRentable.sol/ERC721BlacklistDiscreteRentable.json";
import ERC721BlacklistDiscreteRentableRandomEthberrySol from "@framework/core-contracts/artifacts/contracts/ERC721/random/ERC721BlacklistDiscreteRandomEthberry.sol/ERC721BlacklistDiscreteRandomEthberry.json";

export const Erc721ABI = new Interface(ERC721BlacklistDiscreteRentableSol.abi);
export const Erc721ABIRandom = new Interface(ERC721BlacklistDiscreteRentableRandomEthberrySol.abi);
