import { Interface } from "ethers";

import MysteryBoxSol from "@framework/core-contracts/artifacts/contracts/Mechanics/MysteryBox/ERC721MysteryBoxSimple.sol/ERC721MysteryBoxSimple.json";

export const MysteryBoxABI = new Interface(MysteryBoxSol.abi);
