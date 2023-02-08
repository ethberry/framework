import { FormatTypes, Interface } from "@ethersproject/abi";

import ERC721UpgradeableRandomBlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721UpgradeableRandomBlacklist.sol/ERC721UpgradeableRandomBlacklist.json";

export const ABI = new Interface(ERC721UpgradeableRandomBlacklistSol.abi).format(FormatTypes.full);
