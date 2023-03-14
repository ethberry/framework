import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PyramidDepositService } from "./deposit.service";
import { PyramidDepositEntity } from "./deposit.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PyramidDepositEntity])],
  providers: [PyramidDepositService],
  exports: [PyramidDepositService],
})
export class PyramidDepositModule {}
