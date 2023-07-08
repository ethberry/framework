import { Interface } from "ethers";

import ERC998BlacklistUpgradeableSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998BlacklistUpgradeable.sol/ERC998BlacklistUpgradeable.json";

export const ABI = new Interface(ERC998BlacklistUpgradeableSol.abi);
