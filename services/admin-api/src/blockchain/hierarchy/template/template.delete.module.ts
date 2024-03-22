import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TemplateEntity } from "./template.entity";
import { TokenModule } from "../token/token.module";
import { AssetModule } from "../../exchange/asset/asset.module";
import { MysteryBoxModule } from "../../mechanics/marketing/mystery/box/box.module";
import { ClaimTemplateModule } from "../../mechanics/marketing/claim/template/template.module";
import { TemplateDeleteService } from "./template.delete.service";
import { CraftModule } from "../../mechanics/gaming/recipes/craft/craft.module";
import { MergeModule } from "../../mechanics/gaming/recipes/merge/merge.module";
import { DismantleModule } from "../../mechanics/gaming/recipes/dismantle/dismantle.module";
import { GradeModule } from "../../mechanics/gaming/grade/grade.module";
import { WaitListListModule } from "../../mechanics/marketing/wait-list/list/list.module";
import { RentModule } from "../../mechanics/gaming/rent/rent.module";
import { StakingRulesModule } from "../../mechanics/marketing/staking/rules/rules.module";

@Module({
  imports: [
    TokenModule,
    forwardRef(() => AssetModule),
    forwardRef(() => MysteryBoxModule),
    forwardRef(() => CraftModule),
    forwardRef(() => MergeModule),
    forwardRef(() => DismantleModule),
    forwardRef(() => GradeModule),
    forwardRef(() => WaitListListModule),
    forwardRef(() => RentModule),
    forwardRef(() => StakingRulesModule),
    TypeOrmModule.forFeature([TemplateEntity]),
    ClaimTemplateModule,
  ],
  providers: [TemplateDeleteService],
  exports: [TemplateDeleteService],
})
export class TemplateDeleteModule {}
