import { Interface } from "ethers";

import VestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/Vesting.sol/Vesting.json";

export const VestingABI = new Interface(VestingSol.abi);