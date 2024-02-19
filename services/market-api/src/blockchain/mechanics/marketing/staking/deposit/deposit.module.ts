import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingDepositService } from "./deposit.service";
import { StakingDepositController } from "./deposit.controller";
import { StakingDepositEntity } from "./deposit.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StakingDepositEntity])],
  providers: [StakingDepositService],
  controllers: [StakingDepositController],
  exports: [StakingDepositService],
})
export class StakingDepositModule {}
