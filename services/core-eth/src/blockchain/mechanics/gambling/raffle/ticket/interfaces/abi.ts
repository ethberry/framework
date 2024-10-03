import { Interface } from "ethers";

import RaffleTicketSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/ERC721RaffleTicket.sol/ERC721RaffleTicket.json";

export const RaffleTicketABI = new Interface(RaffleTicketSol.abi);
