import { Interface } from "ethers";

import ERC721DiscreteSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Discrete/ERC721Discrete.sol/ERC721Discrete.json";

export const ERC721DiscreteABI = new Interface(ERC721DiscreteSol.abi);
