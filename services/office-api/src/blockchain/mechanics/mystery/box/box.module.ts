import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../hierarchy/template/template.module";
import { TokenModule } from "../../../hierarchy/token/token.module";
import { AssetModule } from "../../../exchange/asset/asset.module";
import { MysteryBoxEntity } from "./box.entity";
import { MysteryBoxService } from "./box.service";
import { MysteryBoxController } from "./box.controller";

@Module({
  imports: [ContractModule, TemplateModule, TokenModule, AssetModule, TypeOrmModule.forFeature([MysteryBoxEntity])],
  providers: [MysteryBoxService],
  controllers: [MysteryBoxController],
  exports: [MysteryBoxService],
})
export class MysteryBoxModule {}
