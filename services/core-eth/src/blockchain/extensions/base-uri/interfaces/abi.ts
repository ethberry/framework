import { Interface } from "ethers";

import BaseUrlSol from "@framework/core-contracts/artifacts/@ethberry/contracts-erc721/contracts/extensions/ERC721ABaseUrl.sol/ERC721ABaseUrl.json";

export const BaseUrlABI = new Interface(BaseUrlSol.abi);
