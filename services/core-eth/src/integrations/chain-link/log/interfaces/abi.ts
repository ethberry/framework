import { FormatTypes, Interface } from "@ethersproject/abi";

import ERC721FullSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721BlacklistUpgradeableRandom.sol/ERC721BlacklistUpgradeableRandom.json";

export const ABI = new Interface(ERC721FullSol.abi).format(FormatTypes.full);
