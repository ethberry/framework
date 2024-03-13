import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TemplateEntity } from "./template.entity";
import { TemplateService } from "./template.service";
import { TemplateController } from "./template.controller";
import { TokenModule } from "../token/token.module";
import { AssetModule } from "../../exchange/asset/asset.module";
import { ContractModule } from "../contract/contract.module";
import { MysteryBoxModule } from "../../mechanics/marketing/mystery/box/box.module";

@Module({
  imports: [
    TokenModule,
    forwardRef(() => AssetModule),
    forwardRef(() => MysteryBoxModule),
    ContractModule,
    TypeOrmModule.forFeature([TemplateEntity]),
  ],
  providers: [TemplateService],
  controllers: [TemplateController],
  exports: [TemplateService],
})
export class TemplateModule {}
