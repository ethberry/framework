import { Interface } from "ethers";

import LotteryTicketSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/ERC721LotteryTicket.sol/ERC721LotteryTicket.json";

export const LotteryTicketABI = new Interface(LotteryTicketSol.abi);
