import { Interface } from "ethers";

import LegacyVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/LegacyVesting/LegacyVesting.sol/LegacyVesting.json";

export const LegacyVestingABI = new Interface(LegacyVestingSol.abi);
