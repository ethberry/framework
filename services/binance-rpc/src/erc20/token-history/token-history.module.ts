import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc20TokenHistoryEntity } from "./token-history.entity";
import { Erc20TokenHistoryService } from "./token-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc20TokenHistoryEntity])],
  providers: [Erc20TokenHistoryService],
  exports: [Erc20TokenHistoryService],
})
export class Erc20TokenHistoryModule {}
