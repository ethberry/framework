import { Interface } from "ethers";

import RoyaltySol from "@framework/core-contracts/artifacts/@ethberry/contracts-erc721/contracts/extensions/ERC721ARoyalty.sol/ERC721ARoyalty.json";

export const RoyaltyABI = new Interface(RoyaltySol.abi);
