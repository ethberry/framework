import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingDepositService } from "./deposit.service";
import { StakingDepositEntity } from "./deposit.entity";
import { BalanceModule } from "../../../../hierarchy/balance/balance.module";

@Module({
  imports: [BalanceModule, TypeOrmModule.forFeature([StakingDepositEntity])],
  providers: [StakingDepositService],
  exports: [StakingDepositService],
})
export class StakingDepositModule {}
