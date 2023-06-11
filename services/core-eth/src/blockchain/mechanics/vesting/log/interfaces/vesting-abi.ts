import { Interface } from "ethers";

import CliffVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/CliffVesting.sol/CliffVesting.json";
import GradedVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/GradedVesting.sol/GradedVesting.json";
import LinearVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/LinearVesting.sol/LinearVesting.json";

const iface1 = new Interface(CliffVestingSol.abi).format();
const iface2 = new Interface(GradedVestingSol.abi).format();
const iface3 = new Interface(LinearVestingSol.abi).format();

export const VestingAbi = [...new Set(iface1.concat(iface2).concat(iface3))];
