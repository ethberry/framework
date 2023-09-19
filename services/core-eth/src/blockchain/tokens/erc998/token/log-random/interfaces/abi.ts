import { Interface } from "ethers";

import ERC998BlacklistDiscreteRandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998BlacklistDiscreteRandom.sol/ERC998BlacklistDiscreteRandom.json";

export const ABIRandom = new Interface(ERC998BlacklistDiscreteRandomSol.abi);
