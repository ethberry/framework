import { Interface } from "ethers";

import RoyaltySol from "@framework/core-contracts/artifacts/@ethberry/contracts-erc721/contracts/interfaces/IERC721Royalty.sol/IERC721Royalty.json";

export const RoyaltyABI = new Interface(RoyaltySol.abi);
