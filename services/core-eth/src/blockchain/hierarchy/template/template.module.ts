import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TemplateService } from "./template.service";
import { TemplateEntity } from "./template.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity])],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
