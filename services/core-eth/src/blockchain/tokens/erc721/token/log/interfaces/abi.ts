import { Interface } from "ethers";

import ERC721BlacklistDiscreteRentableSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721BlacklistDiscreteRentable.sol/ERC721BlacklistDiscreteRentable.json";

export const ABI = new Interface(ERC721BlacklistDiscreteRentableSol.abi);
