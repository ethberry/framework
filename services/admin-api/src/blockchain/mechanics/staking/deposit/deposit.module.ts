import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingDepositService } from "./deposit.service";
import { StakingDepositEntity } from "./deposit.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StakingDepositEntity])],
  providers: [StakingDepositService],
  exports: [StakingDepositService],
})
export class StakingDepositModule {}
