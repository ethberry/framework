import { Module } from "@nestjs/common";

import { RaffleRoundModule } from "./round/round.module";

@Module({
  imports: [RaffleRoundModule],
})
export class RaffleModule {}
