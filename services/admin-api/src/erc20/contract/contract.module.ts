import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20ContractService } from "./contract.service";
import { Erc20TokenController } from "./contract.controller";
import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template/uni-template.entity";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract/uni-contract.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UniContractEntity, UniTemplateEntity])],
  providers: [Erc20ContractService],
  controllers: [Erc20TokenController],
  exports: [Erc20ContractService],
})
export class Erc20ContractModule {}
