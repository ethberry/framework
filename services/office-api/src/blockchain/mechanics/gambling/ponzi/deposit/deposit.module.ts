import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PonziDepositService } from "./deposit.service";
import { PonziDepositEntity } from "./deposit.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PonziDepositEntity])],
  providers: [PonziDepositService],
  exports: [PonziDepositService],
})
export class PonziDepositModule {}
