import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MarketplaceService } from "./marketplace.service";
import { MarketplaceController } from "./marketplace.controller";
import { TokenEntity } from "../../hierarchy/token/token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  providers: [MarketplaceService],
  controllers: [MarketplaceController],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
