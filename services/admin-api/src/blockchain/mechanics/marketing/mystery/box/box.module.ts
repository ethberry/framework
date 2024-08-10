import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../../hierarchy/template/template.module";
import { TemplateDeleteModule } from "../../../../hierarchy/template/template.delete.module";
import { TokenModule } from "../../../../hierarchy/token/token.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { ClaimTemplateModule } from "../../claim/template/template.module";
import { MysteryBoxEntity } from "./box.entity";
import { MysteryBoxService } from "./box.service";
import { MysteryBoxController } from "./box.controller";

@Module({
  imports: [
    ContractModule,
    TokenModule,
    forwardRef(() => AssetModule),
    forwardRef(() => TemplateModule),
    forwardRef(() => TemplateDeleteModule),
    TypeOrmModule.forFeature([MysteryBoxEntity]),
    ClaimTemplateModule,
  ],
  providers: [MysteryBoxService],
  controllers: [MysteryBoxController],
  exports: [MysteryBoxService],
})
export class MysteryBoxModule {}
