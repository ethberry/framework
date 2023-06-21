import { Interface } from "ethers";

import ERC721BlacklistUpgradeableRentableSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721BlacklistUpgradeableRentable.sol/ERC721BlacklistUpgradeableRentable.json";

export const ABI = new Interface(ERC721BlacklistUpgradeableRentableSol.abi);
