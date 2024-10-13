import { Interface } from "ethers";

import ERC721GenesSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Genes/networks/ERC721GenesEthberry.sol/ERC721GenesEthberry.json";

export const ERC721GenesABI = new Interface(ERC721GenesSol.abi);
