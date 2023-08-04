import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CollectionContractService } from "./contract.service";
import { CollectionContractController } from "./contract.controller";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { CollectionTemplateModule } from "../template/template.module";
import { CollectionTokenModule } from "../token/token.module";

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([ContractEntity]), CollectionTemplateModule, CollectionTokenModule],
  providers: [Logger, CollectionContractService],
  controllers: [CollectionContractController],
  exports: [CollectionContractService],
})
export class CollectionContractModule {}
