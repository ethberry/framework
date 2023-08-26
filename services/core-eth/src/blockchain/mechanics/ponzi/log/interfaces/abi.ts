import { Interface } from "ethers";

import PonziSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Ponzi/Ponzi.sol/Ponzi.json";

export const ABI = new Interface(PonziSol.abi);
