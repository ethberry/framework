import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20ContractService } from "./contract.service";
import { Erc20TokenController } from "./contract.controller";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity, TemplateEntity, TokenEntity])],
  providers: [Erc20ContractService],
  controllers: [Erc20TokenController],
  exports: [Erc20ContractService],
})
export class Erc20ContractModule {}
