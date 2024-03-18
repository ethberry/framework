import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TemplateEntity } from "./template.entity";
import { TokenModule } from "../token/token.module";
import { AssetModule } from "../../exchange/asset/asset.module";
import { MysteryBoxModule } from "../../mechanics/marketing/mystery/box/box.module";
import { ClaimTemplateModule } from "../../mechanics/marketing/claim/template/template.module";
import { TemplateDeleteService } from "./template.delete.service";
import { CraftModule } from "../../mechanics/gaming/recipes/craft/craft.module";

@Module({
  imports: [
    TokenModule,
    forwardRef(() => AssetModule),
    forwardRef(() => MysteryBoxModule),
    forwardRef(() => CraftModule),
    forwardRef(() => MysteryBoxModule),
    forwardRef(() => MysteryBoxModule),
    TypeOrmModule.forFeature([TemplateEntity]),
    ClaimTemplateModule,
  ],
  providers: [TemplateDeleteService],
  exports: [TemplateDeleteService],
})
export class TemplateDeleteModule {}
