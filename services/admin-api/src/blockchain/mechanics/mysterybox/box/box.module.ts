import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { MysteryboxBoxEntity } from "./box.entity";
import { MysteryboxBoxService } from "./box.service";
import { MysteryboxBoxController } from "./box.controller";
import { AssetModule } from "../../asset/asset.module";

@Module({
  imports: [ContractModule, TemplateModule, AssetModule, TypeOrmModule.forFeature([MysteryboxBoxEntity])],
  providers: [MysteryboxBoxService],
  controllers: [MysteryboxBoxController],
  exports: [MysteryboxBoxService],
})
export class MysteryboxBoxModule {}
