import { Interface } from "ethers";

import ERC721RentableSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Rentable/ERC721Rentable.sol/ERC721Rentable.json";

export const ERC721RentableABI = new Interface(ERC721RentableSol.abi);
