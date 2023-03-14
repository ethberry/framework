import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NativeContractService } from "./contract.service";
import { NativeTokenController } from "./contract.controller";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity, TemplateEntity, TokenEntity])],
  providers: [NativeContractService],
  controllers: [NativeTokenController],
  exports: [NativeContractService],
})
export class NativeContractModule {}
