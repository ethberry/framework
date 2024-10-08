import { Interface } from "ethers";

import WrapperSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Wrapper/ERC721Wrapper.sol/ERC721Wrapper.json";

export const WrapperABI = new Interface(WrapperSol.abi);
