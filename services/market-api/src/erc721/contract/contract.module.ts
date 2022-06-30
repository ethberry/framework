import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721CollectionService } from "./contract.service";
import { Erc721CollectionController } from "./contract.controller";
import { Erc721TokenModule } from "../token/token.module";
import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ContractEntity]), Erc721TokenModule],
  providers: [Erc721CollectionService],
  controllers: [Erc721CollectionController],
  exports: [Erc721CollectionService],
})
export class Erc721CollectionModule {}
