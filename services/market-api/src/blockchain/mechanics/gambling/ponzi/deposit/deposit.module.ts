import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PonziDepositService } from "./deposit.service";
import { PonziDepositController } from "./deposit.controller";
import { PonziDepositEntity } from "./deposit.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PonziDepositEntity])],
  providers: [PonziDepositService],
  controllers: [PonziDepositController],
  exports: [PonziDepositService],
})
export class PonziDepositModule {}
