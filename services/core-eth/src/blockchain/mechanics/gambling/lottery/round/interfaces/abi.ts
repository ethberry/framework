import { Interface } from "ethers";

import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/random/LotteryRandomGemunion.sol/LotteryRandomGemunion.json";

export const LotteryABI = new Interface(LotterySol.abi);
