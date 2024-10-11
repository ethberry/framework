import { Interface } from "ethers";

import AccessControlSol from "@framework/core-contracts/artifacts/@openzeppelin/contracts/access/AccessControl.sol/AccessControl.json";

export const AccessControlABI = new Interface(AccessControlSol.abi);
