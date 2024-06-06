import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TokenEntity } from "../../../../../hierarchy/token/token.entity";
import { LotteryTicketTokenService } from "./token.service";
import { LotteryTicketTokenController } from "./token.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [LotteryTicketTokenService],
  controllers: [LotteryTicketTokenController],
  exports: [LotteryTicketTokenService],
})
export class LotteryTicketTokenModule {}
