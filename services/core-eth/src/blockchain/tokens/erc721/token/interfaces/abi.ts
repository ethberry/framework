import { Interface } from "ethers";

import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";

export const ERC721SimpleABI = new Interface(ERC721SimpleSol.abi);
