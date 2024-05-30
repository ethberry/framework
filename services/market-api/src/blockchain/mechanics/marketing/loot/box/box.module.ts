import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LootBoxEntity } from "./box.entity";
import { LootBoxService } from "./box.service";
import { TemplateModule } from "../../../../hierarchy/template/template.module";
import { LootBoxController } from "./box.controller";

@Module({
  imports: [TemplateModule, TypeOrmModule.forFeature([LootBoxEntity])],
  providers: [Logger, LootBoxService],
  controllers: [LootBoxController],
  exports: [LootBoxService],
})
export class LootBoxModule {}
