import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20ContractService } from "./contract.service";
import { Erc20TokenController } from "./contract.controller";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";
import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity, TemplateEntity])],
  providers: [Erc20ContractService],
  controllers: [Erc20TokenController],
  exports: [Erc20ContractService],
})
export class Erc20ContractModule {}
