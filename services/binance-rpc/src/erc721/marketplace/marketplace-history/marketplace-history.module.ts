import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721MarketplaceHistoryEntity } from "./marketplace-history.entity";
import { Erc721MarketplaceHistoryService } from "./marketplace-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721MarketplaceHistoryEntity])],
  providers: [Erc721MarketplaceHistoryService],
  exports: [Erc721MarketplaceHistoryService],
})
export class Erc721MarketplaceHistoryModule {}
