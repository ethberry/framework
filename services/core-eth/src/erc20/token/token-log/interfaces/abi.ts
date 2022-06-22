import { FormatTypes, Interface } from "@ethersproject/abi";

import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC20BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20BlackList.sol/ERC20BlackList.json";

const iface1 = new Interface(ERC20SimpleSol.abi).format(FormatTypes.full) as Array<string>;
const iface2 = new Interface(ERC20BlackListSol.abi).format(FormatTypes.full) as Array<string>;

export const Erc20abi = [...new Set(([] as Array<any>).concat(iface1, iface2))];
