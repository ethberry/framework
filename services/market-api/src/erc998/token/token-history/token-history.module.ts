import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998TokenHistoryEntity } from "./token-history.entity";
import { Erc998TokenHistoryService } from "./token-history.service";
import { Erc998TokenHistoryController } from "./token-history.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Erc998TokenHistoryEntity])],
  providers: [Erc998TokenHistoryService],
  controllers: [Erc998TokenHistoryController],
  exports: [Erc998TokenHistoryService],
})
export class Erc998TokenHistoryModule {}
