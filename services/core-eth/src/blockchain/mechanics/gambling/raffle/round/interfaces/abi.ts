import { Interface } from "ethers";

import RaffleSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/Raffle.sol/Raffle.json";

export const RaffleABI = new Interface(RaffleSol.abi);
