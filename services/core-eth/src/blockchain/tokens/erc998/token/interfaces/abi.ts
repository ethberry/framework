import { Interface } from "ethers";

import ERC998BlacklistDiscreteSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998BlacklistDiscrete.sol/ERC998BlacklistDiscrete.json";
import ERC998BlacklistDiscreteRandomBesuSol from "@framework/core-contracts/artifacts/contracts/ERC998/random/ERC998BlacklistDiscreteRandomGemunion.sol/ERC998BlacklistDiscreteRandomGemunion.json";

export const Erc998ABI = new Interface(ERC998BlacklistDiscreteSol.abi);

export const Erc998ABIRandom = new Interface(ERC998BlacklistDiscreteRandomBesuSol.abi);
