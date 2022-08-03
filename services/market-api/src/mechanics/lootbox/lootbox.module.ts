import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { LootboxEntity } from "./lootbox.entity";
import { LootboxService } from "./lootbox.service";
import { LootboxController } from "./lootbox.controller";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";

@Module({
  imports: [SignerModule, TemplateModule, TypeOrmModule.forFeature([LootboxEntity])],
  providers: [Logger, LootboxService],
  controllers: [LootboxController],
  exports: [LootboxService],
})
export class LootboxModule {}
