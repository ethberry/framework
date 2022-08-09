import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NativeContractService } from "./contract.service";
import { NativeTokenController } from "./contract.controller";
import { TemplateEntity } from "../../../blockchain/hierarchy/template/template.entity";
import { ContractEntity } from "../../../blockchain/hierarchy/contract/contract.entity";
import { TokenEntity } from "../../../blockchain/hierarchy/token/token.entity";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity, TemplateEntity, TokenEntity])],
  providers: [NativeContractService],
  controllers: [NativeTokenController],
  exports: [NativeContractService],
})
export class NativeContractModule {}
