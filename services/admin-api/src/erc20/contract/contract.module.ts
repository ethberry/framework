import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20ContractService } from "./contract.service";
import { Erc20TokenController } from "./contract.controller";
import { UniTemplateEntity } from "../../uni-token/uni-template.entity";
import { UniContractEntity } from "../../uni-token/uni-contract.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UniContractEntity, UniTemplateEntity])],
  providers: [Erc20ContractService],
  controllers: [Erc20TokenController],
  exports: [Erc20ContractService],
})
export class Erc20ContractModule {}
