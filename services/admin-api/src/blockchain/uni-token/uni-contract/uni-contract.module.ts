import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UniContractEntity } from "./uni-contract.entity";
import { UniContractService } from "./uni-contract.service";
import { UniContractController } from "./uni-contract.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UniContractEntity])],
  providers: [UniContractService],
  controllers: [UniContractController],
  exports: [UniContractService],
})
export class UniContractModule {}
