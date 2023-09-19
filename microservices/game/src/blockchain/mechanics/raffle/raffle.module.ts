import { Module } from "@nestjs/common";

import { RaffleSignModule } from "./sign/sign.module";
import { RaffleRoundModule } from "./round/round.module";
import { RaffleTokenModule } from "./token/token.module";
import { RaffleContractModule } from "./contract/raffle.module";

@Module({
  imports: [RaffleContractModule, RaffleRoundModule, RaffleTokenModule, RaffleSignModule],
})
export class RaffleModule {}
