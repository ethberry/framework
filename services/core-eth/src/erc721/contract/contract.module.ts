import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721ContractService } from "./contract.service";
import { Erc721TokenModule } from "../token/token.module";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UniContractEntity]), forwardRef(() => Erc721TokenModule)],
  providers: [Erc721ContractService],
  exports: [Erc721ContractService],
})
export class Erc721ContractModule {}
