import { Interface } from "ethers";

import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";

export const ERC20SimpleABI = new Interface(ERC20SimpleSol.abi);
