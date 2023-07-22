import { Interface } from "ethers";

import ERC998BlacklistDiscreteSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998BlacklistDiscrete.sol/ERC998BlacklistDiscrete.json";

export const ABI = new Interface(ERC998BlacklistDiscreteSol.abi);
