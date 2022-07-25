import { FormatTypes, Interface } from "@ethersproject/abi";

import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC20BlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Blacklist.sol/ERC20Blacklist.json";

const iface1 = new Interface(ERC20SimpleSol.abi).format(FormatTypes.full) as Array<string>;
const iface2 = new Interface(ERC20BlacklistSol.abi).format(FormatTypes.full) as Array<string>;

export const ABI = [...new Set(([] as Array<any>).concat(iface1, iface2))];
