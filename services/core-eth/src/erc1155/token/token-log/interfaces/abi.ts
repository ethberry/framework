import { FormatTypes, Interface } from "@ethersproject/abi";

import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC1155BlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Blacklist.sol/ERC721Blacklist.json";

const iface1 = new Interface(ERC1155SimpleSol.abi).format(FormatTypes.full) as Array<any>;
const iface2 = new Interface(ERC1155BlacklistSol.abi).format(FormatTypes.full) as Array<any>;

export const ABI = [...new Set(([] as Array<any>).concat(iface1, iface2))];
