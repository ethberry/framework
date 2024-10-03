import { Interface } from "ethers";

import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";

export const StakingABI = new Interface(StakingSol.abi);
