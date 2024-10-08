import { Interface } from "ethers";

import WaitListSol from "@framework/core-contracts/artifacts/contracts/Mechanics/WaitList/WaitList.sol/WaitList.json";

export const WaitListABI = new Interface(WaitListSol.abi);
