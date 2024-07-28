import { Interface } from "ethers";

import ERC721DiscreteSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Discrete.sol/ERC721Discrete.json";

export const ABI = new Interface(ERC721DiscreteSol.abi);
