import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LotteryTicketTokenService } from "./token.service";
import { LotteryTicketTokenController } from "./token.controller";
import { TokenEntity } from "../../../../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [LotteryTicketTokenService],
  controllers: [LotteryTicketTokenController],
  exports: [LotteryTicketTokenService],
})
export class LotteryTicketTokenModule {}
