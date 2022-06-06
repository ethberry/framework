import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc1155MarketplaceHistoryEntity } from "./marketplace-history.entity";
import { Erc1155MarketplaceHistoryService } from "./marketplace-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc1155MarketplaceHistoryEntity])],
  providers: [Erc1155MarketplaceHistoryService],
  exports: [Erc1155MarketplaceHistoryService],
})
export class Erc1155MarketplaceHistoryModule {}
