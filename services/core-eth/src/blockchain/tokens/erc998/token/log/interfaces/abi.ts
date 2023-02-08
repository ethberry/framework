import { FormatTypes, Interface } from "@ethersproject/abi";

import ERC998UpgradeableRandomBlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998UpgradeableRandomBlacklist.sol/ERC998UpgradeableRandomBlacklist.json";

export const ABI = new Interface(ERC998UpgradeableRandomBlacklistSol.abi).format(FormatTypes.full);
