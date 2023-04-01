import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TemplateEntity } from "./template.entity";
import { TemplateService } from "./template.service";
import { TemplateController } from "./template.controller";
import { AssetModule } from "../../exchange/asset/asset.module";
import { TokenModule } from "../token/token.module";

@Module({
  imports: [TokenModule, forwardRef(() => AssetModule), TypeOrmModule.forFeature([TemplateEntity])],
  providers: [TemplateService],
  controllers: [TemplateController],
  exports: [TemplateService],
})
export class TemplateModule {}
