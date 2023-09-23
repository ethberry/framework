import { forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TokenModule } from "../../hierarchy/token/token.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { EventHistoryModule } from "../../event-history/event-history.module";
import { AssetComponentHistoryEntity } from "./asset-component-history.entity";
import { AssetService } from "./asset.service";
import { AssetEntity } from "./asset.entity";
import { ContractModule } from "../../hierarchy/contract/contract.module";

@Module({
  imports: [
    ConfigModule,
    EventHistoryModule,
    TokenModule,
    ContractModule,
    forwardRef(() => TemplateModule),
    TypeOrmModule.forFeature([AssetEntity, AssetComponentHistoryEntity]),
  ],
  providers: [Logger, AssetService],
  exports: [AssetService],
})
export class AssetModule {}
