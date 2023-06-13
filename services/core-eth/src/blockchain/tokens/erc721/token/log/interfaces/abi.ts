import { Interface } from "ethers";

import ERC721BlacklistUpgradeableRentableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721BlacklistUpgradeableRentableRandom.sol/ERC721BlacklistUpgradeableRentableRandom.json";

export const ABI = new Interface(ERC721BlacklistUpgradeableRentableRandomSol.abi);
