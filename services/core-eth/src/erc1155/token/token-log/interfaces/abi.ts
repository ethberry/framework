import { FormatTypes, Interface } from "@ethersproject/abi";

import ERC1155Blacklist from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Blacklist.sol/ERC1155Blacklist.json";

export const ABI = new Interface(ERC1155Blacklist.abi).format(FormatTypes.full) as Array<any>;
