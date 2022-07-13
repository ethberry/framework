import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TemplateEntity } from "./template.entity";
import { TemplateService } from "./template.service";

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity])],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
