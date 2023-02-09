import { FormatTypes, Interface } from "@ethersproject/abi";

import ERC998BlacklistUpgradeableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998BlacklistUpgradeableRandom.sol/ERC998UpgradeableRandom.json";

export const ABI = new Interface(ERC998BlacklistUpgradeableRandomSol.abi).format(FormatTypes.full);
