import { Interface } from "ethers";

// import ERC721BlacklistDiscreteRentableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721BlacklistDiscreteRentableRandom.sol/ERC721BlacklistDiscreteRentableRandom.json";
import ERC721BlacklistDiscreteRentableRandomBesuSol from "@framework/core-contracts/artifacts/contracts/ERC721/random/ERC721BlacklistDiscreteRandomBesu.sol/ERC721BlacklistDiscreteRandomBesu.json";
// TODO add setVrfSubs. abi here
export const ABIRandom = new Interface(ERC721BlacklistDiscreteRentableRandomBesuSol.abi);
