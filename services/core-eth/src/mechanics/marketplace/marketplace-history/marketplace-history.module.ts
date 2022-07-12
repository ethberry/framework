import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MarketplaceHistoryEntity } from "./marketplace-history.entity";
import { MarketplaceHistoryService } from "./marketplace-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([MarketplaceHistoryEntity])],
  providers: [MarketplaceHistoryService],
  exports: [MarketplaceHistoryService],
})
export class MarketplaceHistoryModule {}
