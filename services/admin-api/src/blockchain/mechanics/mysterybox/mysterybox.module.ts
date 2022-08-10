import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../hierarchy/template/template.module";
import { MysteryboxEntity } from "./mysterybox.entity";
import { MysteryboxService } from "./mysterybox.service";
import { MysteryboxController } from "./mysterybox.controller";
import { AssetModule } from "../asset/asset.module";

@Module({
  imports: [ContractModule, TemplateModule, AssetModule, TypeOrmModule.forFeature([MysteryboxEntity])],
  providers: [MysteryboxService],
  controllers: [MysteryboxController],
  exports: [MysteryboxService],
})
export class MysteryboxModule {}
