import { Interface } from "ethers";

import AccessControlSol from "@framework/core-contracts/artifacts/@openzeppelin/contracts/access/AccessControl.sol/AccessControl.json";
import OwnableSol from "@framework/core-contracts/artifacts/@openzeppelin/contracts/access/Ownable.sol/Ownable.json";

export const AccessControlABI = new Interface(AccessControlSol.abi);
export const OwnableABI = new Interface(OwnableSol.abi);
