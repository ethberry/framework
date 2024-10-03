import { Interface } from "ethers";

import LootSol from "@framework/core-contracts/artifacts/contracts/Mechanics/LootBox/ERC721LootBoxBlacklistPausable.sol/ERC721LootBoxBlacklistPausable.json";

export const LootABI = new Interface(LootSol.abi);
