import { Module } from "@nestjs/common";

import { RaffleLeaderboardModule } from "./leaderboard/leaderboard.module";
import { RaffleSignModule } from "./sign/sign.module";
import { RaffleRoundModule } from "./round/round.module";
import { RaffleTicketModule } from "./token/ticket.module";
import { RaffleContractModule } from "./contract/raffle.module";

@Module({
  imports: [RaffleContractModule, RaffleRoundModule, RaffleTicketModule, RaffleSignModule, RaffleLeaderboardModule],
})
export class RaffleModule {}
