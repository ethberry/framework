import { Interface } from "ethers";

import ERC1155Blacklist from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Blacklist.sol/ERC1155Blacklist.json";

export const Erc1155ABI = new Interface(ERC1155Blacklist.abi);
