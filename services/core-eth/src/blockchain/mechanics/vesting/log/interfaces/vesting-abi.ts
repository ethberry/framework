import { Interface } from "ethers";

import CliffVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/CliffVesting.sol/CliffVesting.json";
import GradedVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/GradedVesting.sol/GradedVesting.json";
import LinearVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/LinearVesting.sol/LinearVesting.json";

const abi1 = CliffVestingSol.abi;
const abi2 = GradedVestingSol.abi;
const abi3 = LinearVestingSol.abi;
const fullAbi = [...new Set(abi1.concat(abi2).concat(abi3))];

export const VestingInterface = new Interface(fullAbi);
