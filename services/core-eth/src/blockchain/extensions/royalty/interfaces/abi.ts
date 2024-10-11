import { Interface } from "ethers";

import RoyaltySol from "@framework/core-contracts/artifacts/@openzeppelin/contracts/token/common/ERC2981.sol/ERC2981.json";

export const RoyaltyABI = new Interface(RoyaltySol.abi);
