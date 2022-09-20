import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PyramidDepositService } from "./deposit.service";
import { PyramidDepositController } from "./deposit.controller";
import { PyramidDepositEntity } from "./deposit.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PyramidDepositEntity])],
  providers: [PyramidDepositService],
  controllers: [PyramidDepositController],
  exports: [PyramidDepositService],
})
export class PyramidDepositModule {}
