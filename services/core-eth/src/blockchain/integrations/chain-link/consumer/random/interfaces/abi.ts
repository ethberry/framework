import { Interface } from "ethers";

import ERC721RandomSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Random/networks/ERC721RandomEthberry.sol/ERC721RandomEthberry.json";

export const ERC721RandomABI = new Interface(ERC721RandomSol.abi);
