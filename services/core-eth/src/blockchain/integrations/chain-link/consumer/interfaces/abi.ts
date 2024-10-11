import { Interface } from "ethers";

import ERC721RandomSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Random/ERC721Random.sol/ERC721Random.json";

export const ERC721RandomABI = new Interface(ERC721RandomSol.abi);
