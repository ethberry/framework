import { Interface } from "ethers";

import ERC721CollectionSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Collection/ERC721CSimple.sol/ERC721CSimple.json";

export const ERC721CollectionABI = new Interface(ERC721CollectionSol.abi);
