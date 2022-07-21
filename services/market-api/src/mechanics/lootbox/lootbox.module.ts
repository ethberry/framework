import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LootboxEntity } from "./lootbox.entity";
import { LootboxService } from "./lootbox.service";
import { LootboxController } from "./lootbox.controller";
import { SignerModule } from "../signer/signer.module";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";

@Module({
  imports: [ConfigModule, SignerModule, TemplateModule, TypeOrmModule.forFeature([LootboxEntity])],
  providers: [Logger, LootboxService],
  controllers: [LootboxController],
  exports: [LootboxService],
})
export class LootboxModule {}
