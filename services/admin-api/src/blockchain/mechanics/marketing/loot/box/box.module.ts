import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../../hierarchy/template/template.module";
import { TokenModule } from "../../../../hierarchy/token/token.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { LootBoxEntity } from "./box.entity";
import { LootBoxService } from "./box.service";
import { LootBoxController } from "./box.controller";
import { ClaimTemplateModule } from "../../claim/template/template.module";
import { TemplateDeleteModule } from "../../../../hierarchy/template/template.delete.module";

@Module({
  imports: [
    ContractModule,
    TokenModule,
    forwardRef(() => AssetModule),
    forwardRef(() => TemplateModule),
    forwardRef(() => TemplateDeleteModule),
    TypeOrmModule.forFeature([LootBoxEntity]),
    ClaimTemplateModule,
  ],
  providers: [LootBoxService],
  controllers: [LootBoxController],
  exports: [LootBoxService],
})
export class LootBoxModule {}
