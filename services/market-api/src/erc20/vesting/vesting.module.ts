import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20VestingService } from "./vesting.service";
import { Erc20VestingEntity } from "./vesting.entity";
import { Erc20VestingController } from "./vesting.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Erc20VestingEntity])],
  providers: [Erc20VestingService],
  controllers: [Erc20VestingController],
  exports: [Erc20VestingService],
})
export class Erc20VestingModule {}
