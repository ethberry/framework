import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TemplateEntity } from "./template.entity";
import { TemplateService } from "./template.service";
import { AssetModule } from "../../exchange/asset/asset.module";

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity]), forwardRef(() => AssetModule)],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
