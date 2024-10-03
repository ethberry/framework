import { Interface } from "ethers";

import MysterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/MysteryBox/ERC721MysteryBoxBlacklistPausable.sol/ERC721MysteryBoxBlacklistPausable.json";

export const MysteryABI = new Interface(MysterySol.abi);
