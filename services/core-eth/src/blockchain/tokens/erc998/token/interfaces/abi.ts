import { Interface } from "ethers";

import ERC998SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Simple.sol/ERC998Simple.json";

export const ERC998SimpleABI = new Interface(ERC998SimpleSol.abi);
