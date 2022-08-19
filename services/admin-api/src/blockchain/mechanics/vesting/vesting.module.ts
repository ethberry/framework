import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VestingService } from "./vesting.service";
import { VestingEntity } from "./vesting.entity";
import { VestingController } from "./vesting.controller";

@Module({
  imports: [TypeOrmModule.forFeature([VestingEntity])],
  providers: [VestingService],
  controllers: [VestingController],
  exports: [VestingService],
})
export class VestingModule {}
