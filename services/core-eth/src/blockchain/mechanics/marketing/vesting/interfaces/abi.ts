import { Interface } from "ethers";

import VestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/ERC721Vesting.sol/ERC721Vesting.json";

export const VestingABI = new Interface(VestingSol.abi);
