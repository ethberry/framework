import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721ContractService } from "./contract.service";
import { Erc721ContractController } from "./contract.controller";
import { Erc721TokenModule } from "../token/token.module";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity]), Erc721TokenModule],
  providers: [Erc721ContractService],
  controllers: [Erc721ContractController],
  exports: [Erc721ContractService],
})
export class Erc721ContractModule {}
