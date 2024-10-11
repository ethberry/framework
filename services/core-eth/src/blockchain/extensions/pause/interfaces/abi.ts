import { Interface } from "ethers";

import PausableSol from "@framework/core-contracts/artifacts/@openzeppelin/contracts/utils/Pausable.sol/Pausable.json";

export const PausableABI = new Interface(PausableSol.abi);
