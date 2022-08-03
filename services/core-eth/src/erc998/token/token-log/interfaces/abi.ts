import { FormatTypes, Interface } from "@ethersproject/abi";

import ERC998SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Simple.sol/ERC998Simple.json";
import ERC998BlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Blacklist.sol/ERC998Blacklist.json";
import ERC998UpgradeableSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Upgradeable.sol/ERC998Upgradeable.json";
import ERC998RandomTestSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Random.sol/ERC998Random.json";

const iface1 = new Interface(ERC998SimpleSol.abi).format(FormatTypes.full) as Array<any>;
const iface2 = new Interface(ERC998BlacklistSol.abi).format(FormatTypes.full) as Array<any>;
const iface3 = new Interface(ERC998UpgradeableSol.abi).format(FormatTypes.full) as Array<any>;
const iface4 = new Interface(ERC998RandomTestSol.abi).format(FormatTypes.full) as Array<any>;

export const ABI = [...new Set(([] as Array<any>).concat(iface1, iface2, iface3, iface4))];
