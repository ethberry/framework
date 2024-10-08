import { Interface } from "ethers";

import RaffleSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/random/RaffleRandomGemunion.sol/RaffleRandomGemunion.json";

export const RaffleABI = new Interface(RaffleSol.abi);
