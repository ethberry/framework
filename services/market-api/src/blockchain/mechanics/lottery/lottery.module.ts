import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { LotteryLeaderboardModule } from "./leaderboard/leaderboard.module";
import { LotterySignModule } from "./sign/sign.module";
import { LotteryRoundModule } from "./round/round.module";
import { LotteryTicketModule } from "./token/ticket.module";
import { LotteryContractService } from "./lottery.service";
import { LotteryContractController } from "./lottery.controller";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ContractEntity]),
    LotteryRoundModule,
    LotteryTicketModule,
    LotterySignModule,
    LotteryLeaderboardModule,
  ],
  providers: [LotteryContractService],
  controllers: [LotteryContractController],
  exports: [LotteryContractService],
})
export class LotteryModule {}
