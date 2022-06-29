import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998CollectionService } from "./contract.service";
import { Erc998TokenModule } from "../token/token.module";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniContractEntity]), forwardRef(() => Erc998TokenModule)],
  providers: [Erc998CollectionService],
  exports: [Erc998CollectionService],
})
export class Erc998CoontractModule {}
