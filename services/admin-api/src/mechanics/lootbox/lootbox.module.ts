import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../blockchain/hierarchy/contract/contract.module";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";
import { LootboxEntity } from "./lootbox.entity";
import { LootboxService } from "./lootbox.service";
import { LootboxController } from "./lootbox.controller";
import { AssetModule } from "../asset/asset.module";

@Module({
  imports: [ContractModule, TemplateModule, AssetModule, TypeOrmModule.forFeature([LootboxEntity])],
  providers: [LootboxService],
  controllers: [LootboxController],
  exports: [LootboxService],
})
export class LootboxModule {}
