import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// for some reason TemplateDeleteService should go before MysteryBoxModule
import { TemplateDeleteService } from "./template.delete.service";
import { AssetModule } from "../../exchange/asset/asset.module";
import { MysteryBoxModule } from "../../mechanics/marketing/mystery/box/box.module";
import { ClaimTemplateModule } from "../../mechanics/marketing/claim/template/template.module";
import { DiscreteModule } from "../../mechanics/gaming/discrete/discrete.module";
import { WaitListListModule } from "../../mechanics/marketing/wait-list/list/list.module";
import { StakingRulesModule } from "../../mechanics/marketing/staking/rules/rules.module";
import { PonziRulesModule } from "../../mechanics/gambling/ponzi/rules/rules.module";
import { TokenModule } from "../token/token.module";
import { TemplateEntity } from "./template.entity";

@Module({
  imports: [
    TokenModule,
    forwardRef(() => AssetModule),
    forwardRef(() => MysteryBoxModule),
    forwardRef(() => DiscreteModule),
    forwardRef(() => WaitListListModule),
    forwardRef(() => StakingRulesModule),
    forwardRef(() => PonziRulesModule),
    TypeOrmModule.forFeature([TemplateEntity]),
    ClaimTemplateModule,
  ],
  providers: [TemplateDeleteService],
  exports: [TemplateDeleteService],
})
export class TemplateDeleteModule {}
