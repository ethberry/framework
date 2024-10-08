import { Interface } from "ethers";

import PonziSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Ponzi/Ponzi.sol/Ponzi.json";

export const PonziABI = new Interface(PonziSol.abi);
