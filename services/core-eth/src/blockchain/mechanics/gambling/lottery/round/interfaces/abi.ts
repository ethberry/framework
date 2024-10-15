import { Interface } from "ethers";

import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/Lottery.sol/Lottery.json";

export const LotteryABI = new Interface(LotterySol.abi);
