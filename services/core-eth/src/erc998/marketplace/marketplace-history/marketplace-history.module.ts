import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998MarketplaceHistoryEntity } from "./marketplace-history.entity";
import { Erc998MarketplaceHistoryService } from "./marketplace-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc998MarketplaceHistoryEntity])],
  providers: [Erc998MarketplaceHistoryService],
  exports: [Erc998MarketplaceHistoryService],
})
export class Erc998MarketplaceHistoryModule {}
