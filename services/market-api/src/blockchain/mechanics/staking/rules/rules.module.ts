import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StakingRulesService } from "./rules.service";
import { StakingRulesController } from "./rules.controller";
import { StakingRulesEntity } from "./rules.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StakingRulesEntity])],
  providers: [StakingRulesService],
  controllers: [StakingRulesController],
  exports: [StakingRulesService],
})
export class StakingRulesModule {}
