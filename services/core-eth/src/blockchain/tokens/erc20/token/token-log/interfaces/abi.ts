import { FormatTypes, Interface } from "@ethersproject/abi";

import ERC20BlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Blacklist.sol/ERC20Blacklist.json";

export const ABI = new Interface(ERC20BlacklistSol.abi).format(FormatTypes.full);
