// import { ContractInterface } from "@ethersproject/contracts";
import { Interface, FormatTypes } from "@ethersproject/abi";

import ERC20SimpleSol from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC20BlistSol from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20BlackList.sol/ERC20BlackList.json";

const iface1 = new Interface(ERC20SimpleSol.abi).format(FormatTypes.minimal) as Array<string>;
const iface2 = new Interface(ERC20BlistSol.abi).format(FormatTypes.minimal) as Array<string>;

export const Erc20abi = [...new Set(iface1.concat(iface2))];