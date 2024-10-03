import { Interface } from "ethers";

import ERC20BlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Blacklist.sol/ERC20Blacklist.json";
import ERC20WhitelistSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Whitelist.sol/ERC20Whitelist.json";

export const Erc20ABI = new Interface(ERC20BlacklistSol.abi.concat(ERC20WhitelistSol.abi));
